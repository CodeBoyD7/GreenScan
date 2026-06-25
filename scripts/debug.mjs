import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";

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

  // Collect JS errors
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto(base, { waitUntil: "networkidle0" });
  await wait(5000);

  // Log any errors
  if (errors.length) console.log("JS Errors:", errors.join("\n  "));

  // Debug: find tab bar elements by position
  const tabInfo = await page.evaluate(() => {
    const allElements = [...document.querySelectorAll("div")];
    const bottom = window.innerHeight - 80;
    const bottomEls = allElements.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= bottom && r.bottom <= window.innerHeight + 10 && r.width > 30;
    });
    const unique = [];
    const seen = new Set();
    for (const el of bottomEls) {
      const r = el.getBoundingClientRect();
      const k = `${Math.round(r.left)}-${Math.round(r.top)}`;
      if (!seen.has(k)) {
        seen.add(k);
        unique.push({ tag: el.tagName, className: el.className?.slice(0, 60), text: el.textContent?.slice(0, 40), rect: `${Math.round(r.width)}x${Math.round(r.height)} @ ${Math.round(r.left)},${Math.round(r.top)}` });
      }
    }
    return unique;
  });
  console.log("Tab bar elements:");
  tabInfo.forEach((el, i) => console.log(`  [${i}] ${el.tagName} ${el.className} "${el.text}" ${el.rect}`));

  // Try clicking by finding text "హోమ్" and navigating up to the clickable parent
  console.log("\nTrying to click 'హోమ్' tab...");
  const clicked = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim();
      if (t === "హోమ్" || t === "ఆరోగ్య స్కాన్" || t === "మైక్రోగ్రీన్స్" || t === "డాష్‌బోర్డ్") {
        console.log("Found tab text:", t);
        // Try to find the Pressable button ancestor
        let el = node.parentElement;
        while (el) {
          // Check if this element is a Pressable (div with pointer cursor)
          const style = window.getComputedStyle(el);
          if (style.cursor === "pointer" || el.style.cursor === "pointer") {
            // Dispatch a click event
            const event = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
            el.dispatchEvent(event);
            return t;
          }
          el = el.parentElement;
        }
        // Try clicking parent directly as fallback
        node.parentElement?.click();
        return t;
      }
    }
    return null;
  });
  console.log("Clicked:", clicked);
  await wait(2000);

  // Check if we actually navigated
  const afterClick = await page.evaluate(() => {
    const root = document.getElementById("root");
    return { text: root?.textContent?.slice(0, 200) };
  });
  console.log("Page text after click:", afterClick.text);

  await page.screenshot({ path: path.join(outDir, "debug2.png"), fullPage: true });
  await browser.close();
  server.close();
})();
