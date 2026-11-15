#!/usr/bin/env python3
"""Validate the staged image and rehearse rollback using an isolated restored copy."""
import pathlib,time,json,subprocess as sp,tarfile,hashlib,os
root=pathlib.Path.cwd(); p=root/'release-private';os.umask(0o077)
for _ in range(40):
 if (p/'stage.json').exists():break
 time.sleep(1)
if not (p/'stage.json').exists():
 print('BUILD_STILL_RUNNING');print((p/'build.log').read_text()[-600:]);raise SystemExit(0)
if (p/'candidate-tests.json').exists():print((p/'candidate-tests.json').read_text());raise SystemExit(0)
def run(a,**k):return sp.run(a,check=True,**k)
def out(a):return sp.check_output(a,text=True)
stage='v79-academy-curriculum-stage'
for name in ['academy-api.test.mjs','self-paced-api.test.mjs']:
 run(['docker','cp',str(root/'tests'/name),stage+':/tmp/'+name],stdout=sp.DEVNULL)
 run(['docker','exec','-e','ACADEMY_STANDALONE_ADMIN_ENABLED=1',stage,'node','/tmp/'+name])
restored=p/'rollback-rehearsal';restored.mkdir()
with tarfile.open(p/'stage-data.tar.gz') as t:t.extractall(restored,filter='data')
original=(restored/'data/store.json').read_bytes();learners=(restored/'data/learners.json').read_bytes()
old='v79-academy-curriculum-rollback-test'
try:
 run(['docker','run','-d','--name',old,'--restart','no','--network','none','--user',str(os.getuid())+':'+str(os.getgid()),'--cap-drop','ALL','--security-opt','no-new-privileges','--mount','type=bind,src='+str(restored/'data')+',dst=/app/data','-e','NODE_ENV=production','-e','V79_PLATFORM_SHARED_SECRET=isolated-rollback-review-secret-20261115','-e','ACADEMY_COURSE_PUBLISH_MODE=academy','-e','V79_HUB_EVENT_URL=','sha256:c5b30fc92f01df167b7b78ba11ca79925f014d56a5d75c53bc0dc0049636c1e3'],stdout=sp.DEVNULL)
 for _ in range(30):
  r=sp.run(['docker','exec',old,'node','-e',"fetch('http://127.0.0.1:3030/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=sp.DEVNULL,stderr=sp.DEVNULL)
  if r.returncode==0:break
  time.sleep(1)
 else:raise RuntimeError('Rollback image health failed')
 if (restored/'data/store.json').read_bytes()!=original or (restored/'data/learners.json').read_bytes()!=learners:raise RuntimeError('Rollback restoration changed records')
 print('OLD_IMAGE_RESTORED_COPY_AND_LEARNER_BYTES=PASS')
finally:
 run(['docker','rm','-f',old],stdout=sp.DEVNULL)
result={'candidateApiTests':True,'bothAdultCoursesTested':True,'oldImageRestoredHealthy':True,'rollbackLearnersUnchanged':True,'source':json.loads((p/'stage.json').read_text())['source']}
(p/'candidate-tests.json').write_text(json.dumps(result));print(json.dumps(result))

