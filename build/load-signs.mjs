// ---------------------------------------------------------------------------
// Loads sign content, merging content/_shared.yml underneath each sign so the
// boilerplate exists once. A sign's own value always wins.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'content');

const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);

function merge(base, over) {
  if (!isPlain(base) || !isPlain(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
  return out;
}

export async function loadSign(file) {
  const shared = YAML.parse(await fs.readFile(path.join(DIR, '_shared.yml'), 'utf8'));
  const sign = YAML.parse(await fs.readFile(file, 'utf8'));
  return merge(shared, sign);
}

export async function signFiles(filter) {
  return (await fs.readdir(DIR))
    .filter((f) => f.endsWith('.yml') && !f.startsWith('_'))
    .filter((f) => !filter || f.includes(filter))
    .sort()
    .map((f) => path.join(DIR, f));
}
