import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const selector = process.argv[3] || '';
const label = process.argv[4] || 'section';

const n = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f)).length + 1;
const filename = `screenshot-${n}-${label}.png`;
const out = join(dir, filename);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 500));

if (selector) {
  const el = await page.$(selector);
  if (el) {
    await el.screenshot({ path: out });
  } else {
    console.log('Selector not found, falling back to full page');
    await page.screenshot({ path: out, fullPage: true });
  }
} else {
  await page.screenshot({ path: out, fullPage: true });
}

await browser.close();
console.log(`Saved: ${out}`);
