import puppeteer from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, 'og-image.png');

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000/og-thumbnail.html', { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluateHandle(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`Saved: ${out}`);
