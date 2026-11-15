#!/usr/bin/env python3
"""Enable live restore, then recover Docker control without intentionally stopping apps.
Run --check without sudo first. Applying requires an interactive administrator.
Never changes Docker's version, storage driver, networks, container data or images.
"""
import datetime, json, os, pathlib, shutil, stat, subprocess as sp, sys, tempfile, time
from docker_recovery_checks import wait_for_live_restore

CONFIG = pathlib.Path('/etc/docker/daemon.json')
CHECK = sys.argv[1:] == ['--check']
if sys.argv[1:] not in ([], ['--check']): raise SystemExit('Usage: recover-docker-control.py [--check]')
def run(args, timeout=15):
 return sp.check_output(args, text=True, stderr=sp.STDOUT, timeout=timeout).strip()
def info(timeout=15): return json.loads(run(['docker', 'info', '--format', '{{json .}}'],timeout=timeout))
def states():
 ids=run(['docker','ps','-q']).split()
 if not ids: raise RuntimeError('No running containers; reconcile manually')
 # Avoid reading other applications credentials or business data.
 rows=[json.loads(line) for line in run(['docker','inspect','--format','{{json .State}}',*ids]).splitlines()]
 return {cid: {'pid': row['Pid'], 'running': row['Running']} for cid,row in zip(ids,rows)}
def atomic(data, mode):
 CONFIG.parent.mkdir(parents=True,exist_ok=True)
 fd,name=tempfile.mkstemp(prefix='.v79-live-restore-',dir=CONFIG.parent)
 try:
  os.fchmod(fd,mode)
  with os.fdopen(fd,'wb') as f: f.write(data);f.flush();os.fsync(f.fileno())
  os.replace(name,CONFIG)
 finally:
  if os.path.exists(name):os.unlink(name)

before_info=info()
if before_info.get('Swarm',{}).get('LocalNodeState') != 'inactive': raise RuntimeError('Standalone Docker only; reconcile Swarm separately')
unit={}
for key in ['KillMode','ExecStop','ExecStopPost']:
 unit[key]=run(['systemctl','show','docker','--property='+key,'--value'])
if unit['KillMode']!='process' or unit['ExecStop'] or unit['ExecStopPost']:
 raise RuntimeError('Custom Docker stop policy requires manual review')
pid=run(['systemctl','show','docker','--property=MainPID','--value'])
args=pathlib.Path('/proc',pid,'cmdline').read_bytes().split(b'\0')
if any(a==b'--config-file' or a.startswith(b'--config-file=') or a.startswith(b'--live-restore') for a in args):
 raise RuntimeError('Explicit daemon configuration flags require manual review')
existed=CONFIG.exists(); original=CONFIG.read_bytes() if existed else None
configuration=json.loads(original) if original else {}
if not isinstance(configuration,dict):raise RuntimeError('Daemon configuration must be a JSON object')
updated={**configuration,'live-restore':True}
candidate=(json.dumps(updated,indent=2)+'\n').encode()
with tempfile.NamedTemporaryFile() as f:
 f.write(candidate);f.flush()
 run([shutil.which('dockerd') or '/usr/bin/dockerd','--validate','--config-file',f.name])
before=states()
print(json.dumps({'preflight':'passed','containers':len(before),'liveRestoreCurrentlyEnabled':before_info.get('LiveRestoreEnabled'),'applyRequiresRoot':True}),flush=True)
if CHECK:raise SystemExit(0)
if os.geteuid()!=0:raise SystemExit('Run with sudo in your own terminal. Never put the password into chat.')

os.umask(0o077)
backup=pathlib.Path('/var/backups')/('v79-docker-control-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.mkdir(mode=0o700)
(backup/'before.json').write_text(json.dumps({'containers':before,'driver':before_info.get('Driver'),'root':before_info.get('DockerRootDir'),'configExisted':existed},indent=2))
if original is not None:(backup/'daemon.json.original').write_bytes(original)
mode=stat.S_IMODE(CONFIG.stat().st_mode) if existed else 0o644
atomic(candidate,mode)
try:
 run(['systemctl','reload','docker'])
 # systemctl reload returns after signalling, before Docker finishes applying it.
 active=wait_for_live_restore(lambda: info(timeout=3),before_info)
 if CONFIG.read_bytes()!=candidate:
  raise RuntimeError('Persistent daemon configuration changed; restart refused')
except Exception:
 # A delayed SIGHUP may still take effect. Removing the persisted setting here
 # could leave runtime protection enabled but lost on the next daemon restart.
 print('Runtime confirmation failed; configuration and backup retained. Docker restart refused.',flush=True)
 raise
print('Live restore verified active. Restarting only the Docker control service.',flush=True)
try:run(['systemctl','restart','docker'],timeout=45)
except sp.TimeoutExpired:
 # Live restore is already verified. Kill only dockerd, never containerd or workloads.
 print('Docker shutdown stalled; recovering its main process with live restore active.',flush=True)
 run(['systemctl','kill','--kill-whom=main','--signal=SIGKILL','docker'])
 sp.run(['systemctl','start','--no-block','docker'],check=True)
for _ in range(30):
 try:
  after_info=info(timeout=3)
  if after_info.get('LiveRestoreEnabled') is True:break
 except (sp.SubprocessError,json.JSONDecodeError):pass
 time.sleep(1)
else:raise RuntimeError('Docker control did not recover. Running workloads must be checked from the server console')
after=states()
changed=[cid[:12] for cid,row in before.items() if after.get(cid)!=row]
result={'dockerControlRecovered':True,'liveRestoreEnabled':True,'runningContainerPidsPreserved':not changed,'changedContainerIds':changed,'backupDirectory':str(backup)}
(backup/'result.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result),flush=True)
if changed:raise SystemExit('A container changed during maintenance; check its health before Academy cutover')
