#!/usr/bin/env bash

set -euo pipefail

pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app deploy:cloudflare:check
