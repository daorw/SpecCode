import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'node_modules/@mariozechner/pi-web-ui/dist/app.css');
const dst = resolve(root, 'public/pi-web-ui/app.css');

mkdirSync(dirname(dst), { recursive: true });

const css = readFileSync(src, 'utf-8');
const cleaned = css.replace(/@font-face\s*\{[^}]*url\(fonts\/[^)]*\)[^}]*\}/g, '');
writeFileSync(dst, cleaned);

const stripped = (css.match(/@font-face/g) || []).length - (cleaned.match(/@font-face/g) || []).length;
console.log(`[prepare-pi-web-ui] Copied app.css (${cleaned.length}B), stripped ${stripped} @font-face blocks`);
