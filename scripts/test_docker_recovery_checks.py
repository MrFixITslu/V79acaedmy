import unittest
import subprocess
from docker_recovery_checks import wait_for_live_restore


class ReloadAcknowledgementTests(unittest.TestCase):
    def setUp(self):
        self.expected = dict(ID='same-daemon', Driver='overlayfs',
                             DockerRootDir='/var/lib/docker', ServerVersion='29.9.3')

    def test_delayed_reload_does_not_trigger_false_rollback(self):
        replies = iter([dict(self.expected, LiveRestoreEnabled=False),
                        dict(self.expected, LiveRestoreEnabled=False),
                        dict(self.expected, LiveRestoreEnabled=True)])
        pauses = []
        result = wait_for_live_restore(lambda: next(replies), self.expected, pause=pauses.append)
        self.assertIs(result['LiveRestoreEnabled'], True)
        self.assertEqual(pauses, [1, 1])

    def test_never_enabled_refuses_restart(self):
        with self.assertRaisesRegex(RuntimeError, 'restart refused'):
            wait_for_live_restore(lambda: dict(self.expected, LiveRestoreEnabled=False),
                                  self.expected, attempts=3, pause=lambda _: None)

    def test_transient_info_timeout_is_retried(self):
        replies = iter([subprocess.TimeoutExpired('docker info', 3),
                        dict(self.expected, LiveRestoreEnabled=True)])
        def read():
            reply = next(replies)
            if isinstance(reply, Exception):
                raise reply
            return reply
        self.assertTrue(wait_for_live_restore(read, self.expected,
                                              pause=lambda _: None)['LiveRestoreEnabled'])

    def test_daemon_change_refuses_even_when_live_restore_is_true(self):
        for key in self.expected:
            with self.subTest(key=key), self.assertRaisesRegex(RuntimeError, 'identity changed'):
                wait_for_live_restore(lambda: dict(self.expected, **{key: 'changed'},
                                                  LiveRestoreEnabled=True), self.expected)

    def test_missing_or_nonboolean_confirmation_is_not_accepted(self):
        for value in [None, 'true', 1]:
            with self.subTest(value=value), self.assertRaises(RuntimeError):
                wait_for_live_restore(lambda: dict(self.expected, LiveRestoreEnabled=value),
                                      self.expected, attempts=1)


if __name__ == '__main__':
    unittest.main()
