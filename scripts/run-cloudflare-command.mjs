import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const command = process.argv[2];

const COMMAND_STEPS = {
  build: [["npx", ["opennextjs-cloudflare", "build"]]],
  deploy: [
    ["npx", ["opennextjs-cloudflare", "build"]],
    ["npx", ["opennextjs-cloudflare", "deploy", "--env", "production"]],
  ],
  upload: [
    ["npx", ["opennextjs-cloudflare", "build"]],
    ["npx", ["opennextjs-cloudflare", "upload", "--env", "production"]],
  ],
  preview: [
    ["npx", ["opennextjs-cloudflare", "build"]],
    ["npx", ["opennextjs-cloudflare", "preview"]],
  ],
};

if (!command || !(command in COMMAND_STEPS)) {
  console.error(
    "Usage: node scripts/run-cloudflare-command.mjs <build|deploy|upload|preview>",
  );
  process.exit(1);
}

const fileEnv = loadProductionEnv();
const env = {
  ...fileEnv,
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? "production",
};

guardProductionEnv(env);

for (const [bin, args] of COMMAND_STEPS[command]) {
  const result = spawnSync(resolveBin(bin), args, {
    cwd: rootDir,
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function loadProductionEnv() {
  const env = {};
  const files = [
    ".env",
    ".env.production",
    ".env.local",
    ".env.production.local",
  ];

  for (const file of files) {
    const filePath = resolve(rootDir, file);
    if (!existsSync(filePath)) continue;

    const parsed = parseEnvFile(readFileSync(filePath, "utf8"));
    Object.assign(env, parsed);
  }

  return env;
}

function parseEnvFile(content) {
  const parsed = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function guardProductionEnv(env) {
  const requiredKeys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SITE_URL",
  ];

  const missing = requiredKeys.filter((key) => !env[key]);
  if (missing.length > 0) {
    fail(`Missing required production env vars: ${missing.join(", ")}`);
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const invalidSupabaseUrls = new Set([
    "http://127.0.0.1:54321",
    "http://localhost:54321",
    "https://your-project.supabase.co",
    siteUrl,
  ]);

  if (invalidSupabaseUrls.has(supabaseUrl)) {
    fail(
      "NEXT_PUBLIC_SUPABASE_URL is still local, placeholder, or equal to the app URL. Set it to your real Supabase Cloud project URL (for example: https://<project-ref>.supabase.co).",
    );
  }

  if (!siteUrl.startsWith("https://")) {
    fail("NEXT_PUBLIC_SITE_URL must use https:// in production.");
  }

  if (siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
    fail("NEXT_PUBLIC_SITE_URL cannot point to localhost in production.");
  }

  if (
    publishableKey === "your_production_supabase_publishable_key" ||
    publishableKey === "dummy-key-for-build"
  ) {
    fail(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is still a placeholder. Replace it with the production Supabase publishable key.",
    );
  }
}

function resolveBin(bin) {
  return process.platform === "win32" ? `${bin}.cmd` : bin;
}

function fail(message) {
  console.error(`\n[cloudflare deploy guard] ${message}\n`);
  process.exit(1);
}
