#!/usr/bin/env python3
"""Academy correction release. Private receipts never enter source control.
stage -> checkpoint -> off-host decrypt/validate -> activate acknowledged SHA.
Only the explicit curriculum correction may change data; rollback retains learners.
"""
import subprocess as sp, pathlib, json, hashlib, tarfile, os, time, sys, copy
ROOT=pathlib.Path.cwd(); P=ROOT/'release-private'; LIVE='v79_course_builder'
STAGE='v79-academy-curriculum-stage'; OLD='v79-academy-pre-curriculum-20261115'
EXPECTED_OLD='sha256:c5b30fc92f01df167b7b78ba11ca79925f014d56a5d75c53bc0dc0049636c1e3'
os.umask(0o077); P.mkdir(mode=0o700,exist_ok=True)
def out(a): return sp.check_output(a,text=True)
def run(a,**kw): return sp.run(a,check=True,**kw)
def inspect(n): return json.loads(out(['docker','inspect',n]))[0]
def save(name,value): (P/name).write_text(json.dumps(value,indent=2))
def sha(value): return hashlib.sha256(value.encode()).hexdigest()
def wait(n):
 for _ in range(45):
  if sp.run(['docker','exec',n,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=sp.DEVNULL,stderr=sp.DEVNULL).returncode==0: return
  time.sleep(1)
 raise RuntimeError('Health check failed')
def snapshot(n):
 script="const f=require('fs');console.log(JSON.stringify({store:JSON.parse(f.readFileSync('/app/data/store.json')),learnerSha:require('crypto').createHash('sha256').update(f.readFileSync('/app/data/learners.json')).digest('hex')}));"
 return json.loads(out(['docker','exec',n,'node','-e',script]))
def verify(before,after):
 expected=json.loads((ROOT/'docs/curriculum-audit/expected-corrections.json').read_text())
 proposed=copy.deepcopy(before['store']); changed=[]; skipped=[]
 for l in proposed['lessons']:
  e=expected['lessons'].get(l['id'])
  if not e: continue
  actual=next(x for x in after['store']['lessons'] if x['id']==l['id'])
  if sha(l.get('lessonContent',''))==e['before']:
   if sha(actual['lessonContent'])!=e['after']: raise RuntimeError('Unexpected corrected lesson hash')
   l['lessonContent']=actual['lessonContent']
   if l.get('review'): l['review']={**l['review'],'status':'review-required'}
   changed.append(l['id'])
  else: skipped.append(l['id'])
 course=next(c for c in proposed['courses'] if c['id']=='course-data-engineering-dp700-01')
 if course['fullDescription']==expected['courseBefore']:
  course['fullDescription']=expected['courseAfter'];course['courseVersion']='1.1.1'
 quiz=next(q for q in proposed['quizzes'] if q['id']=='de-quiz-11')
 q=next(q for q in quiz['questions'] if q['id']=='de-q-11-4')
 keys=['questionText','options','correctAnswer','explanation']
 if all(q[k]==expected['questionBefore'][k] for k in keys):
  for k in ['options','correctAnswer','explanation']: q[k]=expected['questionAfter'][k]
 logs=after['store']['publishingLogs']; oldlogs=proposed['publishingLogs']
 if logs[:len(oldlogs)]!=oldlogs or len(logs)!=len(oldlogs)+1 or logs[-1]['id']!='de-corrections-20261115-v1': raise RuntimeError('Unexpected migration history')
 proposed['publishingLogs']=logs
 if proposed!=after['store']: raise RuntimeError('Unapproved store changes detected')
 if before['learnerSha']!=after['learnerSha']: raise RuntimeError('Learner data changed during startup')
 return {'correctedLessons':len(changed),'preservedEditedLessons':skipped,'allOtherRecordsPreserved':True,'learnerBytesPreserved':True}
def contract(live):
 if live['Image']!=EXPECTED_OLD or len(live['Mounts'])!=1 or set(live['NetworkSettings']['Networks'])!={'proxy_network'} or live['HostConfig']['PortBindings'] not in ({},None): raise RuntimeError('Reconcile changed live runtime before release')
 mount=live['Mounts'][0]
 if mount['Type']!='bind' or mount['Destination']!='/app/data' or not mount['RW']: raise RuntimeError('Unexpected durable mount')
 ids=out(['docker','ps','-q']).split()
 running=json.loads(out(['docker','inspect']+ids)) if ids else []
 writers=[c['Name'] for c in running if any(m['Source']==mount['Source'] and m['RW'] for m in c['Mounts'])]
 if writers!=(['/'+LIVE] if live['State']['Running'] else []): raise RuntimeError('Unexpected live-data writer')
def smoke(n):
 script="""(async()=>{const a=require('assert/strict'),c=require('crypto'),base='http://127.0.0.1:3030';const r=await fetch(base+'/api/public/courses');a.equal(r.status,200);const courses=await r.json();a.equal(courses.length,6);a.equal(courses.filter(x=>x.selfPaced).length,2);for(const p of ['/server.cjs','/data/learners.json','/study/ai-workbook.html'])a.ok([401,403,404].includes((await fetch(base+p)).status));const p='/api/courses',t=String(Date.now()),s=c.createHmac('sha256',process.env.V79_PLATFORM_SHARED_SECRET).update(['GET',p,t,c.createHash('sha256').update('').digest('hex')].join('\\n')).digest('hex');a.equal((await fetch(base+p,{headers:{'x-v79-service-id':'v79-hub','x-v79-timestamp':t,'x-v79-signature':s}})).status,200);console.log('ACCESS_AND_HUB_SIGNED_READ=PASS')})().catch(e=>{console.error(e.message);process.exit(1)})"""
 print(out(['docker','exec',n,'node','-e',script]).strip())
def rollback():
 names=out(['docker','ps','-a','--format','{{.Names}}']).splitlines()
 if OLD not in names: raise RuntimeError('No retained rollback container')
 if LIVE in names:
  run(['docker','stop','--time','20',LIVE],stdout=sp.DEVNULL)
  run(['docker','rename',LIVE,'v79-academy-curriculum-failed-20261115'])
 run(['docker','rename',OLD,LIVE]);run(['docker','update','--restart','always',LIVE],stdout=sp.DEVNULL)
 run(['docker','start',LIVE],stdout=sp.DEVNULL);wait(LIVE)
 print('ROLLBACK=healthy old image; current learner data retained. Restore curriculum backup separately only after reconciliation.')
mode=sys.argv[1]
if mode=='stage':
 if (P/'stage.json').exists(): raise RuntimeError('Stage receipt exists; do not replay')
 live=inspect(LIVE);contract(live);save('runtime.json',live)
 source=out(['git','rev-parse','HEAD']).strip()
 if out(['git','status','--porcelain','--untracked-files=no']).strip(): raise RuntimeError('Dirty tracked source')
 image='v79-academy:curriculum-'+source[:12]
 with (P/'build.log').open('w') as f: run(['docker','build','--build-arg','V79_SOURCE_COMMIT='+source,'-t',image,'.'],stdout=f,stderr=sp.STDOUT)
 if out(['docker','image','inspect',image,'--format','{{ index .Config.Labels "org.opencontainers.image.revision" }}']).strip()!=source: raise RuntimeError('Wrong source label')
 data=P/'restored';data.mkdir()
 # Atomic JSON files can be copied consistently for staging; final checkpoint is quiesced.
 with (P/'stage-data.tar.gz').open('wb') as f: run(['docker','exec',LIVE,'tar','czf','-','-C','/app','data'],stdout=f)
 with tarfile.open(P/'stage-data.tar.gz') as t: t.extractall(data,filter='data')
 before={'store':json.loads((data/'data/store.json').read_text()),'learnerSha':hashlib.sha256((data/'data/learners.json').read_bytes()).hexdigest()}
 for name in ['learner-sessions.json','platform-event-outbox.json']:
  (data/'data'/name).unlink(missing_ok=True)
 run(['docker','run','-d','--name',STAGE,'--restart','no','--network','none','--user',f'{os.getuid()}:{os.getgid()}','--cap-drop','ALL','--security-opt','no-new-privileges','--memory','1g','--cpus','2','--mount',f'type=bind,src={data}/data,dst=/app/data','-e','NODE_ENV=production','-e','V79_PLATFORM_SHARED_SECRET=isolated-curriculum-review-secret-20261115','-e','ACADEMY_COURSE_PUBLISH_MODE=academy','-e','V79_HUB_EVENT_URL=',image],stdout=sp.DEVNULL)
 wait(STAGE);result=verify(before,snapshot(STAGE));smoke(STAGE)
 result.update(source=source,image=image,imageId=inspect(STAGE)['Image'],productionUnchanged=True)
 save('stage.json',result);print(json.dumps(result))
elif mode=='checkpoint':
 if (P/'checkpoint.json').exists(): raise RuntimeError('Checkpoint already exists')
 stage=json.loads((P/'stage.json').read_text());live=inspect(LIVE);contract(live)
 if live['Config']['Env']!=json.loads((P/'runtime.json').read_text())['Config']['Env']: raise RuntimeError('Live environment changed')
 save('runtime.json',live)
 run(['docker','update','--restart','no',LIVE],stdout=sp.DEVNULL);run(['docker','stop','--time','30',LIVE],stdout=sp.DEVNULL)
 try:
  with (P/'data-final.tar').open('wb') as f: run(['docker','cp',LIVE+':/app/data','-'],stdout=f)
  with tarfile.open(P/'data-final.tar') as t:
   count=0
   for m in t.getmembers():
    if m.isfile() and m.name.endswith('.json'): json.loads(t.extractfile(m).read());count+=1
  with tarfile.open(P/'checkpoint.tar.gz','w:gz') as t:
   t.add(P/'data-final.tar',arcname='data-final.tar');t.add(P/'runtime.json',arcname='runtime.json')
  (P/'checkpoint.key').write_text(os.urandom(48).hex())
  run(['openssl','enc','-aes-256-cbc','-salt','-pbkdf2','-iter','200000','-in',str(P/'checkpoint.tar.gz'),'-out',str(P/'checkpoint.enc'),'-pass','file:'+str(P/'checkpoint.key')])
  result={'sha256':hashlib.sha256((P/'checkpoint.enc').read_bytes()).hexdigest(),'validatedJsonFiles':count,'source':stage['source']};save('checkpoint.json',result);print(json.dumps(result))
 except Exception:
  run(['docker','update','--restart','always',LIVE],stdout=sp.DEVNULL);run(['docker','start',LIVE],stdout=sp.DEVNULL);raise
elif mode=='activate':
 checkpoint=json.loads((P/'checkpoint.json').read_text());stage=json.loads((P/'stage.json').read_text())
 if sys.argv[2]!=checkpoint['sha256']: raise RuntimeError('Missing exact off-host verification acknowledgement')
 if (P/'deployed.json').exists(): raise RuntimeError('Already deployed')
 live=inspect(LIVE);contract(live)
 if live['State']['Running'] or inspect(STAGE)['Image']!=stage['imageId']: raise RuntimeError('Release state changed')
 with tarfile.open(P/'data-final.tar') as t:
  def read(name): return t.extractfile(next(m for m in t.getmembers() if m.name.endswith('/'+name))).read()
  before={'store':json.loads(read('store.json')),'learnerSha':hashlib.sha256(read('learners.json')).hexdigest()}
 if any('\n' in e or '\r' in e for e in live['Config']['Env']): raise RuntimeError('Multiline environment unsupported')
 (P/'runtime.env').write_text('\n'.join(live['Config']['Env'])+'\n')
 args=['docker','create','--name',LIVE,'--restart','no','--network','proxy_network','--env-file',str(P/'runtime.env')]
 m=live['Mounts'][0];args+=['--mount',f"type=bind,src={m['Source']},dst=/app/data"]
 for k,v in (live['Config'].get('Labels') or {}).items():
  if k!='org.opencontainers.image.revision': args+=['--label',k+'='+v]
 args+=['--label','org.opencontainers.image.revision='+stage['source'],stage['imageId']]
 try:
  run(['docker','rename',LIVE,OLD]);run(args,stdout=sp.DEVNULL);run(['docker','start',LIVE],stdout=sp.DEVNULL);wait(LIVE)
  result=verify(before,snapshot(LIVE));smoke(LIVE)
  run(['docker','update','--restart',live['HostConfig']['RestartPolicy']['Name'] or 'always',LIVE],stdout=sp.DEVNULL)
  result.update(source=stage['source'],imageId=stage['imageId'],backupSha256=checkpoint['sha256'],rollbackContainer=OLD)
  save('deployed.json',result);print(json.dumps(result))
 except Exception: rollback();raise
elif mode=='rollback': rollback()
else: raise RuntimeError('Unknown release action')
