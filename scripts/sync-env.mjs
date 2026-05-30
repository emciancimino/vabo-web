#!/usr/bin/env node
/**
 * Reads SST outputs from vabo-be and writes the relevant values to .env.local.
 * SST v4 stores outputs in .sst/outputs.json after each deploy.
 *
 * Usage: node scripts/sync-env.mjs [stage]
 * Example: node scripts/sync-env.mjs dev
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const stage = process.argv[2] ?? 'dev';
const beDir = resolve(__dirname, '../../vabo-be');
const outputsPath = resolve(beDir, '.sst/outputs.json');
const envLocalPath = resolve(__dirname, '../.env.local');

// .sst/outputs.json is written by the last local deploy/dev session.
// If missing, attempt a refresh from remote state.
if (!existsSync(outputsPath)) {
  console.log('.sst/outputs.json not found — running sst refresh...');
  try {
    execSync(`npx sst refresh --stage ${stage}`, { cwd: beDir, stdio: 'inherit' });
  } catch {
    console.error('sst refresh failed. Make sure the stack is deployed and AWS credentials are configured.');
    process.exit(1);
  }
}

let outputs;
try {
  outputs = JSON.parse(readFileSync(outputsPath, 'utf8'));
} catch {
  console.error('Failed to parse .sst/outputs.json');
  process.exit(1);
}

const { apiUrl, userPoolId, clientWebId, identityPoolId } = outputs;

if (!userPoolId || !clientWebId || !identityPoolId || !apiUrl) {
  console.error('Missing required outputs in .sst/outputs.json:');
  console.error(JSON.stringify(outputs, null, 2));
  process.exit(1);
}

const content = `# Auto-generated — do not edit manually.
# Run: pnpm sync-env [stage]   (default: dev)
# Stage: ${stage}

NEXT_PUBLIC_COGNITO_USER_POOL_ID=${userPoolId}
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=${clientWebId}
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=${identityPoolId}

# Server-only (non NEXT_PUBLIC): usata dal BFF in app/api/graphql/route.ts.
# Tenuta fuori dal bundle client così l'URL del gateway non è esposto.
API_URL=${apiUrl}
`;

writeFileSync(envLocalPath, content);

console.log('✓ .env.local updated');
console.log(`  User Pool:     ${userPoolId}`);
console.log(`  Client ID:     ${clientWebId}`);
console.log(`  Identity Pool: ${identityPoolId}`);
console.log(`  API URL:       ${apiUrl}`);
