/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const appUrl = process.env.APP_URL || "http://localhost:3002";
const accountPath = path.join(process.cwd(), ".tmp-e2e-account.json");

if (!fs.existsSync(accountPath)) {
  throw new Error("Missing .tmp-e2e-account.json");
}

const account = JSON.parse(fs.readFileSync(accountPath, "utf8"));

async function login(page) {
  const loginUrl = `${appUrl}/api/dev-login?email=${encodeURIComponent(account.email)}&password=${encodeURIComponent(account.password)}&redirect_to=${encodeURIComponent("/dashboard")}`;
  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
  await page.waitForURL(/\/dashboard/, { timeout: 30000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  try {
    await login(page);

    await page.goto(`${appUrl}/dashboard/provider-credentials`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("text=Provider credentials", { timeout: 30000 });
    await page.getByRole("button", { name: /sync readiness/i }).click();
    await page.waitForSelector("text=Provider readiness synced.", { timeout: 30000 });

    await page.goto(`${appUrl}/dashboard/test-center`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("text=Test center", { timeout: 30000 });
    await page.getByRole("button", { name: /run unipile test/i }).click();
    await page.waitForSelector("text=Unipile webhook test delivered into the inbox.", { timeout: 30000 });
    await page.getByRole("button", { name: /run cal\.com test/i }).click();
    await page.waitForSelector("text=Cal.com webhook test synced a booking confirmation.", { timeout: 30000 });
    await page.getByRole("button", { name: /run stripe test/i }).click();
    await page.waitForSelector("text=Stripe webhook test marked the latest order as paid.", { timeout: 30000 });

    await page.goto(`${appUrl}/dashboard/webhooks`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("text=Webhook activity", { timeout: 30000 });
    await page.waitForSelector("text=message.received", { timeout: 30000 });
    await page.waitForSelector("text=checkout.session.completed", { timeout: 30000 });

    await page.goto(`${appUrl}/dashboard/outbox`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("text=Reviewed outbox", { timeout: 30000 });
    await page.waitForSelector("text=Record as sent", { timeout: 30000 }).catch(() => {});

    await page.goto(`${appUrl}/dashboard/go-live`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("text=Go-live checklist", { timeout: 30000 });
    await page.waitForSelector("text=Readiness score", { timeout: 30000 });

    const result = {
      credentialsPageLoaded: true,
      testCenterLoaded: true,
      unipileTestWorked: true,
      calcomTestWorked: true,
      stripeTestWorked: true,
      webhooksPageLoaded: true,
      outboxPageLoaded: true,
      goLivePageLoaded: true,
    };

    fs.writeFileSync(
      path.join(process.cwd(), ".tmp-launch-ops-results.json"),
      JSON.stringify(result, null, 2),
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await page.screenshot({
      path: path.join(process.cwd(), "e2e-launch-ops-check.png"),
      fullPage: true,
    }).catch(() => {});
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
