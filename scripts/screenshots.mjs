import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const outDir = path.resolve(__dirname, "..", "screenshots");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml",
  ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2",
  ".json": "application/json",
};

function serve() {
  const srv = http.createServer((req, res) => {
    let fp = path.join(distDir, req.url === "/" ? "index.html" : req.url);
    if (!fs.existsSync(fp)) fp = path.join(distDir, "index.html");
    const ext = path.extname(fp);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(fs.readFileSync(fp));
  });
  return new Promise((resolve) => srv.listen(0, "127.0.0.1", () => resolve(srv)));
}

function clickTab(page, index) {
  return page.evaluate((idx) => {
    const bottom = window.innerHeight - 80;
    const pressables = [...document.querySelectorAll('[class*="r-1loqt21"]')];
    const tabs = pressables.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= bottom && r.bottom <= window.innerHeight + 10 && r.width > 50;
    });
    if (tabs[idx]) { tabs[idx].click(); return true; }
    // Fallback: try parent of any text
    const allText = [...document.querySelectorAll("div")];
    const bottomText = allText.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= bottom && r.bottom <= window.innerHeight + 10 && r.width > 50;
    });
    if (bottomText[idx]) { bottomText[idx].click(); return true; }
    return false;
  }, index);
}

function clickOption(page, text) {
  return page.evaluate((txt) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim();
      if (t === txt || t.includes(txt)) {
        let el = node.parentElement;
        while (el && el.tagName === "SPAN" || el?.tagName === "DIV" && !el.className?.includes?.("r-1loqt21")) {
          const p = el.parentElement;
          if (p?.className?.includes?.("r-1loqt21")) { p.click(); return true; }
          el = p;
        }
        if (el?.className?.includes?.("r-1loqt21") || el?.onclick || el?.getAttribute?.("onclick")) {
          el.click(); return true;
        }
        // Click any div ancestor with r-1loqt21
        let cur = node.parentElement;
        while (cur) {
          if (cur.className?.includes?.("r-1loqt21") && cur.getBoundingClientRect().width > 50) {
            cur.click(); return true;
          }
          cur = cur.parentElement;
        }
        return false;
      }
    }
    return false;
  }, text);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  console.log(`Server: ${base}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/google-chrome",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const snap = (n) => page.screenshot({ path: path.join(outDir, n), fullPage: true }).then(() => console.log(`   ✓ ${n}`));

  await page.goto(base, { waitUntil: "networkidle0" });
  await wait(4000);

  console.log("1. Home");                    await snap("01-home.png");

  console.log("2. Assessment — age");        await clickTab(page, 1); await wait(3000); await snap("02-assessment-age.png");

  console.log("3. Assessment — gender");     await clickOption(page, "18–30"); await wait(2000); await snap("03-assessment-gender.png");

  console.log("4. Assessment — concern");    await clickOption(page, "పురుషుడు"); await wait(2000); await snap("04-assessment-concern.png");

  console.log("5. Results");                 await clickOption(page, "జీర్ణ సమస్యలు"); await wait(500); await clickOption(page, "సిఫార్సు"); await wait(4000); await snap("05-results.png");

  console.log("6. Microgreens");             await clickTab(page, 2); await wait(3000); await snap("06-microgreens.png");

  console.log("7. Grow Guide");              const cardRect = await page.evaluate(() => { const all = [...document.querySelectorAll("div")]; const cards = all.filter(el => { const r = el.getBoundingClientRect(); return r.top > 60 && r.bottom < window.innerHeight - 100 && r.width > 150 && r.height > 60 && el.textContent.trim().length > 0; }); if (cards.length > 0) { const r = cards[0].getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; } return null; }); if (cardRect) await page.mouse.click(cardRect.x, cardRect.y); await wait(3000); await snap("07-grow-guide.png");

  console.log("8. Dashboard");               await clickTab(page, 3); await wait(3000); await snap("08-dashboard.png");

  await browser.close();
  server.close();
  console.log(`\nDone → ${outDir}`);
})();
