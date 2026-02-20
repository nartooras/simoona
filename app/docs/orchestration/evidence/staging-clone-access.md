# Staging clone access confirmation

- Date (UTC): 2026-02-20T14:16:41.127Z
- Host: 127.0.0.1
- Port: 14333
- Database: SimoonaStagingClone
- Read-only login: simoona_ro
- Result: host reachable, login successful, read-only query successful
- Verification commands:
  - `nc -vz 127.0.0.1 14333`
  - `sqlcmd (container) read-only query`
