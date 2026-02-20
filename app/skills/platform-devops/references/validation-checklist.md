# Validation Checklist

Run this checklist before declaring platform readiness.

## Local Runtime

- required services start successfully via documented commands
- service health checks pass
- local startup works on macOS M3 baseline

## CI/CD

- lint/typecheck/test stages pass
- pipeline uses deterministic dependency install steps
- artifacts/logs are available for debugging

## Config and Secrets

- env vars are documented with purpose and default behavior
- no secrets are committed
- secret source and rotation path are documented

## Deployment

- image build and publish steps are reproducible
- deployment steps are documented for Docker-on-VM target
- rollback/recovery path is defined and tested where possible

## Operational Readiness

- monitoring/logging hooks for critical services are enabled
- common failure modes have actionable runbook steps
