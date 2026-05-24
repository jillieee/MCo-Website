import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const y = parseInt(process.argv[3] || '0');
const label = process.argv[4] || 'instant';
const n = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f)).length + 1;
const out = join(dir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 500));
await page.addStyleTag({ content: 'html { scroll-behavior: instant !important; }' });
await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), y);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: out });
await browser.close();
console.log(`Saved: ${out}`);
