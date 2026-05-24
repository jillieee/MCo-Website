import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const selector = process.argv[3] || '#team';
const label = process.argv[4] || 'bottom';
const n = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f)).length + 1;
const out = join(dir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(process.argv[2] || 'http://localhost:3000', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 500));
const bottom = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  return el ? el.getBoundingClientRect().bottom + window.scrollY : 0;
}, selector);
await page.evaluate((y) => window.scrollTo(0, y - 900), bottom);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: out });
await browser.close();
console.log(`Saved: ${out}`);
