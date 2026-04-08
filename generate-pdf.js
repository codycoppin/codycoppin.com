const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function generate() {
  const dir = __dirname;

  // Local server so Google Fonts can load
  const server = http.createServer((req, res) => {
    const filePath = path.join(dir, req.url === '/' ? 'resume.html' : req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200);
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(8787, resolve));

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8787/', { waitUntil: 'networkidle0', timeout: 20000 });
  await page.evaluateHandle('document.fonts.ready');

  // Hide nav for PDF
  await page.addStyleTag({
    content: `
      nav { display: none !important; }
      .resume { padding: 0 !important; max-width: none !important; }
      body { background: white !important; }
    `
  });

  await page.pdf({
    path: path.join(dir, 'cody-coppin-resume.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
  });

  await browser.close();
  server.close();
  console.log('Generated cody-coppin-resume.pdf');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
