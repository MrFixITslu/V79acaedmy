#!/usr/bin/env python3
"""Run on the authorised V79 server from the checked release checkout. Never prints secrets.
Stages an exact-source image against a private copy of the live JSON store. Does not cut over.
"""
import subprocess as sp, json, pathlib, os, hashlib, tarfile, time, sys, shutil
ROOT=pathlib.Path.cwd(); RELEASE=ROOT/'release-private'; LIVE='v79_course_builder'; STAGE='v79-academy-study-stage'
def run(args,**kw): return sp.run(args,check=True,**kw)
def output(args): return sp.check_output(args,text=True)
def private(path,data):
 path.write_text(data);path.chmod(0o600)
def probe(name,script): return output(['docker','exec',name,'node','-e',script])
os.umask(0o077);RELEASE.mkdir(mode=0o700,exist_ok=True)
if (ROOT/'.git').exists():
 head=output(['git','rev-parse','HEAD']).strip()
 if output(['git','status','--porcelain','--untracked-files=no']).strip():raise RuntimeError('Tracked source is dirty')
else:
 manifest=json.loads((ROOT/'release-source.json').read_text());head=manifest['source']
 for name,expected in manifest['files'].items():
  if hashlib.sha256((ROOT/name).read_bytes()).hexdigest()!=expected:raise RuntimeError('Source archive fingerprint mismatch: '+name)
live=json.loads(output(['docker','inspect',LIVE]))[0]
if live['Image']!='sha256:a32b668a784b534bbde3d8e8ccaf817354ef5e7828dc4217d4919be72eb77769':raise RuntimeError('Live image changed: reconcile before staging')
private(RELEASE/'live-inspect.json',json.dumps(live))
if (RELEASE/'stage-passed.json').exists():raise RuntimeError('Stage was already accepted. Do not replay; inspect its receipt.')
# Capture durable files using the container's root access, without logging their contents.
with (RELEASE/'checkpoint-data.tar.gz').open('wb') as f:run(['docker','exec',LIVE,'tar','czf','-','-C','/app','data'],stdout=f)
# Restore the actual archive into the isolated stage directory and validate all JSON files.
stage_root=RELEASE/'restored';stage_root.mkdir(exist_ok=True)
with tarfile.open(RELEASE/'checkpoint-data.tar.gz') as archive:
 for m in archive.getmembers():
  if m.name.startswith('/') or '..' in pathlib.PurePosixPath(m.name).parts or m.issym() or m.islnk():raise RuntimeError('Unsafe backup path')
 archive.extractall(stage_root,filter='data')
for f in (stage_root/'data').rglob('*.json'):json.loads(f.read_text())
before=json.loads((stage_root/'data/store.json').read_text());learners_before=(stage_root/'data/learners.json').read_bytes()
# No real queued messages or sessions are used by staging. Keep originals in the archive.
for name in ['learner-sessions.json','platform-event-outbox.json']:
 p=stage_root/'data'/name
 if p.exists():p.unlink()
# Build logs remain local; failures can be examined without exposing runtime configuration.
image=f'v79-academy:study-{head[:12]}'
with (RELEASE/'build.log').open('w') as log:run(['docker','build','--build-arg',f'V79_SOURCE_COMMIT={head}','-t',image,'.'],stdout=log,stderr=sp.STDOUT)
revision=output(['docker','image','inspect',image,'--format','{{ index .Config.Labels "org.opencontainers.image.revision" }}']).strip()
if revision!=head:raise RuntimeError('Image revision mismatch')
# Private loopback staging only, synthetic service secret, no real integration credentials/endpoints.
secret='isolated-study-stage-signature-secret-20261115'
run(['docker','run','-d','--name',STAGE,'--restart','no','--user',f'{os.getuid()}:{os.getgid()}','--memory','1g','--cpus','2','--pids-limit','256','--cap-drop','ALL','--security-opt','no-new-privileges','-p','127.0.0.1:13479:3030','-v',f'{stage_root}/data:/app/data','-e','NODE_ENV=production','-e','PORT=3030','-e','ACADEMY_STANDALONE_ADMIN_ENABLED=0','-e','ACADEMY_COURSE_PUBLISH_MODE=academy','-e',f'V79_PLATFORM_SHARED_SECRET={secret}','-e','V79_HUB_EVENT_URL=','-e','V79_HUB_BILLING_URL=','-e','WEBSITE_SYNC_URL=',image],stdout=sp.DEVNULL)
ready=False
for _ in range(45):
 r=sp.run(['docker','exec',STAGE,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=sp.DEVNULL,stderr=sp.DEVNULL)
 if r.returncode==0:ready=True;break
 time.sleep(1)
if not ready:raise RuntimeError('Stage did not become ready; production remains running')
after=json.loads((stage_root/'data/store.json').read_text())
for key in ['courses','lessons','modules','quizzes','assignments','downloads','courseVersions']:
 current={str(x['id']):x for x in after.get(key,[])}
 for old in before.get(key,[]):
  if current.get(str(old['id']))!=old:raise RuntimeError(f'Legacy {key} changed during migration')
if (stage_root/'data/learners.json').read_bytes()!=learners_before:raise RuntimeError('Learner records changed during seeding')
script="""(async()=>{const assert=require('assert/strict');const base='http://127.0.0.1:3030';const c=await(await fetch(base+'/api/public/courses')).json();assert.equal(c.filter(c=>c.selfPaced).length,2);for(const p of ['/server.cjs','/server.cjs.map','/data/learners.json','/study/ai-workbook.html','/api/learners/insights']){const r=await fetch(base+p);assert.ok([401,403,404].includes(r.status),p+' '+r.status)}console.log('STAGE_PRIVATE_FILES_AND_ACCESS=PASS')})().catch(e=>{console.error(e.message);process.exit(1)})"""
print(probe(STAGE,script).strip())
# Encrypt data plus full runtime contract; the key is never printed or added to git.
key=RELEASE/'checkpoint.key';private(key,os.urandom(48).hex())
with tarfile.open(RELEASE/'checkpoint.tar.gz','w:gz') as t:
 t.add(RELEASE/'checkpoint-data.tar.gz',arcname='checkpoint-data.tar.gz');t.add(RELEASE/'live-inspect.json',arcname='live-inspect.json')
run(['openssl','enc','-aes-256-cbc','-salt','-pbkdf2','-iter','200000','-in',str(RELEASE/'checkpoint.tar.gz'),'-out',str(RELEASE/'checkpoint.enc'),'-pass',f'file:{key}'])
receipt={'source':head,'image':image,'imageId':output(['docker','image','inspect',image,'--format','{{.Id}}']).strip(),'stage':STAGE,'backupSha256':hashlib.sha256((RELEASE/'checkpoint.enc').read_bytes()).hexdigest(),'restoredJsonValidated':True,'legacyRecordsPreserved':True,'learnerBytesPreserved':True,'productionUnchanged':True}
private(RELEASE/'stage-passed.json',json.dumps(receipt,indent=2));print(json.dumps(receipt,indent=2))
