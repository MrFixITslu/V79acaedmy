"""Read-only gates used before restarting Docker's control service."""
import json
import subprocess
import time


def wait_for_live_restore(read_info, expected, attempts=20, pause=time.sleep):
    """A systemd reload sends SIGHUP; its completion is not a daemon acknowledgement."""
    for attempt in range(attempts):
        try:
            active = read_info()
        except (subprocess.SubprocessError, json.JSONDecodeError):
            if attempt + 1 < attempts:
                pause(1)
            continue
        for key in ['ID', 'Driver', 'DockerRootDir', 'ServerVersion']:
            if active.get(key) != expected.get(key):
                raise RuntimeError('Daemon identity changed; restart refused')
        if active.get('LiveRestoreEnabled') is True:
            return active
        if attempt + 1 < attempts:
            pause(1)
    raise RuntimeError('Live restore was not activated after waiting; restart refused')
