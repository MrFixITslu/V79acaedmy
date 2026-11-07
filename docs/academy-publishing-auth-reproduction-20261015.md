# P2 Academy — legacy website publishing authentication reproduction

**Isolated development only; NOT a live Academy release.** Hub + Tiquet remain the only products being prepared for commercial launch.

## Brainstorm / REDTEAM
1. Reset the production website admin password and retry — rejected: wrong security boundary, touches production credentials without root-cause proof.
2. Remove the website admin gate so publishing always succeeds — rejected: introduces unauthorized publication and duplicate catalog records.
3. **Selected:** reproduce the exact two-service boundary with disposable Academy data and an emulated local website first. Retain secure existing behavior until the approved canonical publication contract is explicit.

The Academy frontend uses academy.v79sl.com as canonical learning site. The current Academy server nevertheless treats publishing as **two actions**: persist Academy course + publish a separate catalog entry to the legacy website API. It authenticates to that website using server-only WEBSITE_SYNC_URL and WEBSITE_ADMIN_PASSWORD. The error "Incorrect administrator password" can come from that *secondary website login*, not necessarily the Academy/Hub owner login.

## What this PR checks
- Starts a fake website bound to loopback with a synthetic password; denies its first login, then permits it.
- Starts a disposable Academy server with production-mode HTTP behavior, standalone admin enabled **only inside the scratch test**, a fresh isolated data directory and synthetic credentials.
- Verifies unauthorized publishing is denied; a non-admin role cannot publish.
- Verifies website password rejection returns the observed error while the Academy course remains Draft and no website listing is created; synthetic website password is not printed in the response.
- Verifies successful authorized publishing establishes a linked website item, repeated publishing updates that same item rather than creating a duplicate.
- Runs a separate nondeploying CI workflow with build, test and type-check. It does not call production website, Hub, payment providers or external services.

## Remaining
- Independently reproduce exact installed state and identify the desired future contract: Academy portal only, or intentional secondary marketing/catalog publication to v79sl.com.
- Preserve existing course IDs/assets/student progress, and add secure least-privilege server-to-server publication only after choosing the destination contract.
- Avoid login resets, credential output, public posting, production data migrations or test-account deletion. **No production cutover approved by this PR.**

Related: [Academy issue #25](https://github.com/MrFixITslu/V79acaedmy/issues/25), [Hub execution board #152](https://github.com/MrFixITslu/V79hub/issues/152).
