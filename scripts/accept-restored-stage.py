#!/usr/bin/env python3
"""Reconcile and validate the existing isolated image after a restored-copy UID mismatch.
No production mutation. Preserve restrictive file permissions by matching the copy's owner.
"""
import subprocess as s,pathlib,json,os,time,tarfile,hashlib,io
r=pathlib.Path.cwd();p=r/'release-private';name='v79-academy-study-stage';os.umask(0o077)
def out(a):return s.check_output(a,text=True)
old=json.loads(out(['docker','inspect',name]))[0]
if old['State']['Running']:raise RuntimeError('Reconcile the running stage rather than replacing it')
image=old['Image'];source=out(['docker','image','inspect',image,'--format','{{ index .Config.Labels "org.opencontainers.image.revision" }}']).strip()
assert source==out(['git','rev-parse','HEAD']).strip()
s.run(['docker','rename',name,'v79-academy-study-stage-permission-check'],check=True)
s.run(['docker','run','-d','--name',name,'--restart','no','--user',f'{os.getuid()}:{os.getgid()}','--memory','1g','--cpus','2','--pids-limit','256','--cap-drop','ALL','--security-opt','no-new-privileges','-p','127.0.0.1:13479:3030','-v',f'{p}/restored/data:/app/data','-e','NODE_ENV=production','-e','PORT=3030','-e','ACADEMY_STANDALONE_ADMIN_ENABLED=0','-e','ACADEMY_COURSE_PUBLISH_MODE=academy','-e','V79_PLATFORM_SHARED_SECRET=isolated-study-stage-signature-secret-20261115','-e','V79_HUB_EVENT_URL=','-e','V79_HUB_BILLING_URL=','-e','WEBSITE_SYNC_URL=',image],check=True,stdout=s.DEVNULL)
for i in range(40):
 q=s.run(['docker','exec',name,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=s.DEVNULL,stderr=s.DEVNULL)
 if q.returncode==0:break
 time.sleep(1)
else:raise RuntimeError('Isolated stage is not healthy')
with tarfile.open(p/'checkpoint-data.tar.gz') as t:
 store=next(m for m in t.getmembers() if m.name.endswith('/store.json'));before=json.loads(t.extractfile(store).read());member=next(m for m in t.getmembers() if m.name.endswith('/learners.json'));learner_before=t.extractfile(member).read()
after=json.loads((p/'restored/data/store.json').read_text())
for key in ['courses','lessons','modules','quizzes','assignments','downloads','courseVersions']:
 rows={str(x['id']):x for x in after.get(key,[])}
 for x in before.get(key,[]):assert rows[str(x['id'])]==x,'Legacy '+key+' changed'
assert (p/'restored/data/learners.json').read_bytes()==learner_before
code="""(async()=>{const a=require('assert/strict'),base='http://127.0.0.1:3030';const c=await(await fetch(base+'/api/public/courses')).json();a.equal(c.filter(c=>c.selfPaced).length,2);for(const p of ['/server.cjs','/server.cjs.map','/data/learners.json','/study/ai-workbook.html','/api/learners/insights'])a.ok([401,403,404].includes((await fetch(base+p)).status),p);console.log('STAGE_PRIVATE_FILES_AND_ACCESS=PASS')})().catch(e=>{console.error(e.message);process.exit(1)})"""
print(out(['docker','exec',name,'node','-e',code]).strip())
# Execute both account/progress/certificate suites against this exact Node 20 image, without production mounts or network egress.
for test in ['self-paced-api.test.mjs','academy-api.test.mjs']:
 print(out(['docker','run','--rm','--network','none','--user',f'{os.getuid()}:{os.getgid()}','--read-only','--tmpfs','/tmp:rw,nosuid,nodev,size=256m','--memory','1g','--cpus','2','--cap-drop','ALL','--security-opt','no-new-privileges','-v',f'{r}/tests:/qa:ro','--entrypoint','node',image,'/qa/'+test]).strip())
# Boot the retained old image against a separately restored archive to rehearse recovery.
restore=p/'rollback-rehearsal';restore.mkdir(exist_ok=True)
with tarfile.open(p/'checkpoint-data.tar.gz') as t:t.extractall(restore,filter='data')
original=json.loads((p/'live-inspect.json').read_text());restore_name='v79-academy-restore-rehearsal-20261115'
s.run(['docker','run','-d','--rm','--name',restore_name,'--network','none','--user',f'{os.getuid()}:{os.getgid()}','--cap-drop','ALL','--security-opt','no-new-privileges','-v',f'{restore}/data:/app/data','-e','NODE_ENV=production','-e','PORT=3030','-e','V79_HUB_EVENT_URL=',original['Image']],check=True,stdout=s.DEVNULL)
try:
 for i in range(30):
  q=s.run(['docker','exec',restore_name,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=s.DEVNULL,stderr=s.DEVNULL)
  if q.returncode==0:break
  time.sleep(1)
 else:raise RuntimeError('Old-image restore rehearsal failed')
 assert (restore/'data/learners.json').read_bytes()==learner_before
 print('RESTORED_BACKUP_OLD_IMAGE_HEALTH_AND_LEARNER_PRESERVATION=PASS')
finally:s.run(['docker','stop','--time','10',restore_name],check=True,stdout=s.DEVNULL)
key=p/'checkpoint.key';key.write_text(os.urandom(48).hex());key.chmod(0o600)
with tarfile.open(p/'checkpoint.tar.gz','w:gz') as t:t.add(p/'checkpoint-data.tar.gz',arcname='checkpoint-data.tar.gz');t.add(p/'live-inspect.json',arcname='live-inspect.json')
s.run(['openssl','enc','-aes-256-cbc','-salt','-pbkdf2','-iter','200000','-in',str(p/'checkpoint.tar.gz'),'-out',str(p/'checkpoint.enc'),'-pass',f'file:{key}'],check=True)
receipt={'source':source,'image':f'v79-academy:study-{source[:12]}','imageId':image,'stage':name,'backupSha256':hashlib.sha256((p/'checkpoint.enc').read_bytes()).hexdigest(),'restoredJsonValidated':True,'legacyRecordsPreserved':True,'learnerBytesPreserved':True,'oldImageRecoveryRehearsed':True,'exactImageApiSuitesPassed':True,'productionUnchanged':True};(p/'stage-passed.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt,indent=2))
