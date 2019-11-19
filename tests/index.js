const path = require("path");
const puppeteer = require("puppeteer");
const assert = require("assert");

const extensionID = "ljobefblafkbhgjihcfemfeedhkbacel\n";
const extensionPath = path.join(__dirname, "../dist");
const extensionOptionHtml = "option.html";
const extPage = `chrome-extension://${extensionID}/${extensionOptionHtml}`;
let extensionPage = null;
let browser = null;

async function boot() {
  browser = await puppeteer.launch({
    // slowMo: 250,
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  extensionPage = await browser.newPage();
  await extensionPage.goto(extPage);
}

describe("Extension UI Testing", function() {
  this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
  before(async function() {
    await boot();
  });

  describe("option page home", async function() {
    it("check title", async function() {
      const h1 = "Create Custom Handler or Download from  here";
      const extH1 = await extensionPage.evaluate(() =>
        document
          .querySelector("#scrollable-auto-tabpanel-0 > div > div > h3")
          .textContent.trim()
      );
      assert.equal(extH1, h1);
    });
  });

  after(async function() {
    await browser.close();
  });
});
