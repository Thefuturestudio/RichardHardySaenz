/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");

const appUrl = process.env.APP_URL || "http://localhost:3002";
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const accountPath = path.join(process.cwd(), ".tmp-e2e-account.json");
if (!fs.existsSync(accountPath)) {
  throw new Error("Missing .tmp-e2e-account.json");
}

const account = JSON.parse(fs.readFileSync(accountPath, "utf8"));
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function waitForToast(page, text) {
  await page.waitForSelector(`text=${text}`, { timeout: 30000 });
}

async function main() {
  const runId = Date.now();
  const customerName = `Rosa Test ${runId}`;
  const customerPhone = `+507${String(runId).slice(-8)}`;
  const customerEmail = `rosa.${runId}@example.com`;
  const serviceName = `Whitening Consultation ${runId}`;
  const itemName = `Whitening Deposit ${runId}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const getConversationCard = () =>
    page.locator("article").filter({ hasText: customerName }).first();

  try {
    const loginUrl = `${appUrl}/api/dev-login?email=${encodeURIComponent(account.email)}&password=${encodeURIComponent(account.password)}&redirect_to=${encodeURIComponent("/dashboard")}`;
    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });

    await page.goto(`${appUrl}/dashboard/channels/whatsapp-beta`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByRole("button", { name: /prepare beta setup|refresh beta setup/i }).click();
    await waitForToast(page, "WhatsApp beta lane prepared");

    await page.locator('input[name="customer_display_name"]').last().fill(customerName);
    await page.locator('input[name="customer_phone"]').last().fill(customerPhone);
    await page.locator('input[name="customer_email"]').last().fill(customerEmail);
    await page.locator('select[name="intent"]').last().selectOption("booking");
    await page.locator('input[name="summary"]').last().fill("Customer asked for a whitening slot and payment options.");
    await page.locator('textarea[name="body"]').last().fill("Hi, do you have a whitening appointment this Friday afternoon?");
    await page.getByRole("button", { name: /simulate inbound message/i }).click();
    await waitForToast(page, "Inbound WhatsApp test message captured in the inbox.");

    await page.goto(`${appUrl}/dashboard/conversations`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(`text=${customerName}`, { timeout: 30000 });

    await getConversationCard().getByRole("button", { name: /^Claim$/ }).click();
    await waitForToast(page, "Conversation claimed and moved into pending review.");

    await getConversationCard().getByRole("button", { name: /request handoff/i }).click();
    await waitForToast(page, "Human handoff flagged for this conversation.");

    await getConversationCard().getByRole("button", { name: /draft ai reply/i }).click();
    await waitForToast(page, "Draft reply created");

    await getConversationCard().getByRole("button", { name: /queue reviewed reply/i }).click();
    await waitForToast(page, "Draft reply queued for human review.");

    await getConversationCard().getByRole("button", { name: /^Approve$/ }).click();
    await page.waitForSelector('text=Record as sent', { timeout: 30000 });

    await getConversationCard().getByRole("button", { name: /record as sent/i }).click();
    await page.waitForLoadState("networkidle");

    await getConversationCard().locator('input[name="service_name"]').fill(serviceName);
    await getConversationCard().locator('input[name="starts_at"]').fill("2026-05-08T15:30");
    await getConversationCard().locator('input[name="duration_minutes"]').fill("45");
    await getConversationCard().getByRole("button", { name: /create booking draft/i }).click();
    await waitForToast(page, "Booking draft created from the conversation.");

    await getConversationCard().locator('input[name="amount"]').fill("79.00");
    await getConversationCard().locator('input[name="currency"]').fill("USD");
    await getConversationCard().locator('input[name="item_name"]').fill(itemName);
    await getConversationCard().getByRole("button", { name: /create payment draft/i }).click();
    await waitForToast(page, "Payment link draft prepared in test mode.");

    await page.goto(`${appUrl}/dashboard/bookings`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(`text=${serviceName}`, { timeout: 30000 });
    await page
      .locator("article")
      .filter({ hasText: serviceName })
      .getByRole("button", { name: /preview availability/i })
      .click();
    await page.waitForLoadState("networkidle");

    await page.goto(`${appUrl}/dashboard/orders`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(`text=${itemName}`, { timeout: 30000 });
    await page
      .locator("article")
      .filter({ hasText: itemName })
      .getByRole("button", { name: /prepare checkout/i })
      .click();
    await page.waitForLoadState("networkidle");

    const { data: channelBindings, error: channelBindingsError } = await supabase
      .from("channel_bindings")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .eq("provider", "unipile_beta");
    if (channelBindingsError) throw channelBindingsError;

    const { data: betaSessions, error: betaSessionsError } = await supabase
      .from("whatsapp_beta_sessions")
      .select("*")
      .eq("tenant_id", account.tenantId);
    if (betaSessionsError) throw betaSessionsError;

    const { data: conversations, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .order("created_at", { ascending: false });
    if (conversationsError) throw conversationsError;

    const conversation = conversations.find((item) => item.customer_display_name === customerName);
    if (!conversation) throw new Error(`Conversation for ${customerName} not found`);

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .eq("conversation_id", conversation.id);
    if (messagesError) throw messagesError;

    const { data: bookings, error: bookingsError } = await supabase
      .from("booking_records")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .eq("conversation_id", conversation.id);
    if (bookingsError) throw bookingsError;

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .eq("conversation_id", conversation.id);
    if (ordersError) throw ordersError;

    const { data: outboundMessages, error: outboundMessagesError } = await supabase
      .from("outbound_messages")
      .select("*")
      .eq("tenant_id", account.tenantId)
      .eq("conversation_id", conversation.id);
    if (outboundMessagesError) throw outboundMessagesError;

    const booking = bookings.find((item) => item.service_name === serviceName);
    const order = orders.find((item) => item.payment_provider === "stripe_test_preview");

    if (!booking) throw new Error("Booking draft not found after creation");
    if (!order) throw new Error("Order draft not found after creation");

    const externalBookingId = `cal-e2e-${Date.now()}`;

    await supabase
      .from("booking_records")
      .update({ external_booking_id: externalBookingId })
      .eq("id", booking.id)
      .eq("tenant_id", account.tenantId);

    const calcomWebhook = await page.request.post(`${appUrl}/api/webhooks/calcom`, {
      data: {
        event_type: "booking.confirmed",
        tenant_id: account.tenantId,
        external_booking_id: externalBookingId,
      },
    });

    await page.request.post(`${appUrl}/api/webhooks/unipile`, {
      data: {
        event_type: "message.received",
        tenant_id: account.tenantId,
        external_account_id: null,
        external_conversation_id: `chat-${Date.now()}`,
        external_message_id: `msg-${Date.now()}`,
        direction: "inbound",
        from_name: "Webhook Rosa",
        from_phone: "+50769998888",
        text: "Need a payment link from webhook route",
        summary: "Webhook ingestion test",
      },
    });

    const stripeWebhook = await page.request.post(`${appUrl}/api/webhooks/stripe`, {
      data: {
        type: "checkout.session.completed",
        data: {
          object: {
            id: `cs_test_${Date.now()}`,
            metadata: {
              tenant_id: account.tenantId,
              order_id: order.id,
            },
          },
        },
      },
    });

    if (calcomWebhook.status() !== 200) {
      throw new Error(`Cal.com webhook failed with status ${calcomWebhook.status()}`);
    }

    if (stripeWebhook.status() !== 200) {
      throw new Error(`Stripe webhook failed with status ${stripeWebhook.status()}`);
    }

    const { data: refreshedBooking, error: refreshedBookingError } = await supabase
      .from("booking_records")
      .select("*")
      .eq("id", booking.id)
      .single();
    if (refreshedBookingError) throw refreshedBookingError;

    const { data: refreshedOrder, error: refreshedOrderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order.id)
      .single();
    if (refreshedOrderError) throw refreshedOrderError;

    const { data: webhookEvents, error: webhookEventsError } = await supabase
      .from("webhook_ingest_events")
      .select("*")
      .eq("tenant_id", account.tenantId);
    if (webhookEventsError) throw webhookEventsError;

    const result = {
      login: true,
      whatsappBetaPrepared: channelBindings.length > 0 && betaSessions.length > 0,
      conversationCreated: Boolean(conversation),
      humanWorkflowWorked: conversation.status === "pending" && Boolean(conversation.assigned_user_id),
      aiDraftCreated: messages.some(
        (message) =>
          message.sender_type === "assistant" &&
          message.direction === "internal" &&
          message.metadata &&
          typeof message.metadata === "object" &&
          message.metadata.draft === true,
      ),
      bookingDraftCreated: bookings.some((booking) => booking.service_name === serviceName),
      paymentDraftCreated: orders.some((order) => order.payment_provider === "stripe_test_preview"),
      reviewedOutboundWorked: outboundMessages.some(
        (message) => message.review_status === "sent",
      ),
      bookingAvailabilityPreviewWorked: Boolean(
        refreshedBooking.metadata &&
          typeof refreshedBooking.metadata === "object" &&
          refreshedBooking.metadata.availability_preview,
      ),
      checkoutPreparationWorked: Boolean(
        refreshedOrder.metadata &&
          typeof refreshedOrder.metadata === "object" &&
          refreshedOrder.metadata.checkout_prepared_at,
      ),
      webhookIngestionWorked: webhookEvents.length >= 3,
      stripeWebhookWorked: refreshedOrder.status === "paid",
      counts: {
        channelBindings: channelBindings.length,
        betaSessions: betaSessions.length,
        conversations: conversations.length,
        messages: messages.length,
        bookings: bookings.length,
        orders: orders.length,
        outboundMessages: outboundMessages.length,
        webhookEvents: webhookEvents.length,
      },
    };

    fs.writeFileSync(
      path.join(process.cwd(), ".tmp-e2e-results.json"),
      JSON.stringify(result, null, 2),
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await page.screenshot({ path: path.join(process.cwd(), "e2e-five-step-check.png"), fullPage: true }).catch(() => {});
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
