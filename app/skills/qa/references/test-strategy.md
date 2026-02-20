# Test Strategy

Select the smallest complete test set that validates assigned scope.

## Priority Order

1. Task-specific required commands from orchestrator assignment.
2. Contract/parity tests for API behavior changes.
3. Unit/integration tests for modified modules.
4. e2e route tests for user-flow changes.
5. Visual regression checks for UI behavior/style changes.

## Minimum Coverage by Change Type

## API Change

- API unit/integration tests
- contract/parity tests
- auth/permission tests when endpoints are secured

## UI Change

- component/unit tests
- route-level e2e tests
- visual diff checks for changed screens

## Data/Migration Change

- migration dry-run command
- integrity checks (counts/references/checksums)
- rollback rehearsal or validation command

## Integration Change

- real-provider connectivity/config checks for critical integrations
- failure-path tests (timeouts/errors/retries)

## If Commands Are Missing

- Derive commands from repository scripts and test layout.
- Document exactly which commands were chosen and why.
- Mark report as `YELLOW` if confidence is limited by missing coverage.
