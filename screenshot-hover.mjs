import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const n = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f)).length + 1;
const out = join(dir, `screenshot-${n}-hover-demo.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => {
  document.querySelector('#services').scrollIntoView({ behavior: 'instant', block: 'start' });
});
await new Promise(r => setTimeout(r, 300));
// Force hover state on all 4 cards to show the colors
await page.evaluate(() => {
  ['w-01','w-02','w-03','w-04'].forEach((cls, i) => {
    const el = document.querySelector('.svc-card.' + cls);
    if (!el) return;
    const colors = [
      'rgba(74,11,25,0.10)',
      'rgba(168,144,96,0.14)',
      'rgba(122,113,106,0.12)',
      'rgba(109,46,70,0.10)'
    ];
    el.style.background = colors[i];
    el.style.transform = 'translateY(-2px)';
  });
});
await new Promise(r => setTimeout(r, 200));
await page.screenshot({ path: out });
await browser.close();
console.log(`Saved: ${out}`);
