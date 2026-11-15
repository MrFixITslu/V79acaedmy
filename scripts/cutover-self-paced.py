#!/usr/bin/env python3
"""Authorised Academy-only cutover. Run from the isolated server release checkout.
checkpoint -> transfer encrypted checkpoint off host and validate -> activate SHA256.
rollback restarts the retained old container; durable learner records are never replaced.
"""
import subprocess as sp,json,pathlib,os,sys,tarfile,hashlib,time,io
ROOT=pathlib.Path.cwd();P=ROOT/'release-private';LIVE='v79_course_builder';OLD='v79-academy-pre-study-20261115';READY='v79-academy-study-ready'
os.umask(0o077)
def run(a,**k):return sp.run(a,check=True,**k)
def out(a):return sp.check_output(a,text=True)
def inspect(n):return json.loads(out(['docker','inspect',n]))[0]
def save(p,d):p.write_text(json.dumps(d,indent=2));p.chmod(0o600)
def wait(n):
 for _ in range(45):
  r=sp.run(['docker','exec',n,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=sp.DEVNULL,stderr=sp.DEVNULL)
  if r.returncode==0:return
  time.sleep(1)
 raise RuntimeError('Application health check failed')
def rollback():
 names=out(['docker','ps','-a','--format','{{.Names}}']).splitlines()
 if OLD in names:
  if LIVE in names:
   run(['docker','stop','--time','15',LIVE],stdout=sp.DEVNULL)
   run(['docker','rename',LIVE,'v79-academy-study-failed-20261115'])
  run(['docker','rename',OLD,LIVE])
 run(['docker','update','--restart','always',LIVE],stdout=sp.DEVNULL);run(['docker','start',LIVE],stdout=sp.DEVNULL);wait(LIVE)
 print('ROLLBACK_OLD_CONTAINER_HEALTHY; learner data retained')
mode=sys.argv[1]
if mode=='rollback':rollback();sys.exit()
stage=json.loads((P/'stage-passed.json').read_text())
if mode=='checkpoint':
 if (P/'final-checkpoint.json').exists():raise RuntimeError('Final checkpoint exists; reconcile instead of replaying')
 live=inspect(LIVE);baseline=json.loads((P/'live-inspect.json').read_text())
 if live['Image']!=baseline['Image'] or live['Config']['Env']!=baseline['Config']['Env'] or live['Mounts']!=baseline['Mounts']:raise RuntimeError('Runtime changed since staging')
 if len(live['Mounts'])!=1 or live['HostConfig']['PortBindings'] not in ({},None) or set(live['NetworkSettings']['Networks'])!={'proxy_network'}:raise RuntimeError('Unsupported runtime contract')
 if not (P/'browser-passed.json').exists():raise RuntimeError('Browser evidence receipt is required')
 stopped=False
 try:
  save(P/'final-inspect.json',live)
  run(['docker','update','--restart','no',LIVE],stdout=sp.DEVNULL)
  run(['docker','stop','--time','30',LIVE],stdout=sp.DEVNULL);stopped=True
  with (P/'data-final.tar').open('wb') as f:run(['docker','cp',LIVE+':/app/data','-'],stdout=f)
  with tarfile.open(P/'data-final.tar') as t:
   json_count=0
   for m in t.getmembers():
    if m.isfile() and m.name.endswith('.json'):json.loads(t.extractfile(m).read());json_count+=1
  with tarfile.open(P/'final-checkpoint.tar.gz','w:gz') as t:
   t.add(P/'data-final.tar',arcname='data-final.tar');t.add(P/'final-inspect.json',arcname='final-inspect.json')
  key=P/'final-checkpoint.key';key.write_text(os.urandom(48).hex());key.chmod(0o600)
  run(['openssl','enc','-aes-256-cbc','-salt','-pbkdf2','-iter','200000','-in',str(P/'final-checkpoint.tar.gz'),'-out',str(P/'final-checkpoint.enc'),'-pass',f'file:{key}'])
  receipt={'sha256':hashlib.sha256((P/'final-checkpoint.enc').read_bytes()).hexdigest(),'source':stage['source'],'imageId':stage['imageId'],'jsonFilesValidated':json_count,'oldImage':live['Image']};save(P/'final-checkpoint.json',receipt);print(json.dumps(receipt));print('OLD_CONTAINER_STOPPED; exact final checkpoint ready for off-host verification')
 except Exception:
  if stopped:rollback()
  else:run(['docker','update','--restart','always',LIVE],stdout=sp.DEVNULL)
  raise
elif mode=='activate':
 receipt=json.loads((P/'final-checkpoint.json').read_text())
 if sys.argv[2]!=receipt['sha256']:raise RuntimeError('Off-host checkpoint SHA acknowledgement mismatch')
 if (P/'production-passed.json').exists():raise RuntimeError('Release already accepted; do not replay')
 original=json.loads((P/'final-inspect.json').read_text());current=inspect(LIVE)
 if current['Image']!=original['Image'] or current['State']['Running']:raise RuntimeError('Original container is not quiesced as expected')
 if inspect('v79-academy-study-stage')['Image']!=stage['imageId']:raise RuntimeError('Staged image changed')
 # Recover the authoritative store/learner snapshots in memory for preservation checks.
 with tarfile.open(P/'data-final.tar') as t:
  store=next(m for m in t.getmembers() if m.name.endswith('/store.json'));before=json.loads(t.extractfile(store).read())
  member=next(m for m in t.getmembers() if m.name.endswith('/learners.json'));learner_bytes=t.extractfile(member).read()
 env=P/'runtime.env'
 if any('\n' in x or '\r' in x for x in original['Config']['Env']):raise RuntimeError('Multiline env requires explicit runtime handling')
 env.write_text('\n'.join(original['Config']['Env'])+'\n');env.chmod(0o600)
 args=['docker','create','--name',LIVE,'--restart','no','--network','proxy_network','--env-file',str(env)]
 for m in original['Mounts']:args+=['--mount',f"type=bind,src={m['Source']},dst={m['Destination']}"+(',readonly' if not m['RW'] else '')]
 for key,value in (original['Config'].get('Labels') or {}).items():
  if key!='org.opencontainers.image.revision':args+=['--label',key+'='+value]
 args+=['--label','org.opencontainers.image.revision='+stage['source'],'--label','v79.study.release=20261115',stage['imageId']]
 try:
  run(['docker','rename',LIVE,OLD]);run(args,stdout=sp.DEVNULL);run(['docker','start',LIVE],stdout=sp.DEVNULL);wait(LIVE)
  script="""const fs=require('fs');const d=JSON.parse(fs.readFileSync('/app/data/store.json'));console.log(JSON.stringify({courses:d.courses,lessons:d.lessons,modules:d.modules,quizzes:d.quizzes,assignments:d.assignments,downloads:d.downloads,courseVersions:d.courseVersions,learnerSha:require('crypto').createHash('sha256').update(fs.readFileSync('/app/data/learners.json')).digest('hex')}))"""
  # Keep the data returned by docker in memory; never print it.
  after=json.loads(out(['docker','exec',LIVE,'node','-e',script]))
  for key in ['courses','lessons','modules','quizzes','assignments','downloads','courseVersions']:
   current_rows={str(x['id']):x for x in after.get(key,[])}
   for old in before.get(key,[]):
    if current_rows.get(str(old['id']))!=old:raise RuntimeError('Legacy '+key+' changed')
  if after['learnerSha']!=hashlib.sha256(learner_bytes).hexdigest():raise RuntimeError('Learner records changed during startup')
  smoke="""(async()=>{const assert=require('assert/strict'),crypto=require('crypto');const base='http://127.0.0.1:3030';const catalog=await(await fetch(base+'/api/public/courses')).json();assert.equal(catalog.filter(c=>c.selfPaced).length,2);for(const p of ['/server.cjs','/server.cjs.map','/data/learners.json','/study/ai-workbook.html','/api/learners/insights']){const r=await fetch(base+p);assert.ok([401,403,404].includes(r.status),p)}for(const route of ['/api/courses','/api/learners/insights']){const stamp=String(Date.now()),sig=crypto.createHmac('sha256',process.env.V79_PLATFORM_SHARED_SECRET).update(['GET',route,stamp,crypto.createHash('sha256').update('').digest('hex')].join('\\n')).digest('hex');const r=await fetch(base+route,{headers:{'x-v79-service-id':'v79-hub','x-v79-timestamp':stamp,'x-v79-signature':sig}});assert.equal(r.status,200,route)}console.log('PUBLIC_ACCESS_AND_HUB_SIGNATURE_SMOKE=PASS')})().catch(e=>{console.error(e.message);process.exit(1)})"""
  print(out(['docker','exec',LIVE,'node','-e',smoke]).strip())
  run(['docker','update','--restart',original['HostConfig']['RestartPolicy']['Name'] or 'no',LIVE],stdout=sp.DEVNULL)
  result={'source':stage['source'],'imageId':stage['imageId'],'legacyRecordsPreserved':True,'learnerBytesPreserved':True,'hubSignedReadPassed':True,'backupSha256':receipt['sha256'],'rollbackContainer':OLD,'status':'deployed; external smoke pending'};save(P/'production-passed.json',result);print(json.dumps(result,indent=2))
 except Exception:
  rollback();raise
else:raise RuntimeError('Unknown release action')
