// scripts/registerWebhook.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function registerWebhook() {
  try {
    // Public webhook URL (ngrok/local tunnel or deployed backend)
    const webhookUrl = process.env.WEBHOOK_URL || "https://abcd1234.ngrok.io/webhook";

    // Organization URI from Calendly (fetch via GET /users/me)
    const orgUri = `https://api.calendly.com/organizations/${process.env.ORG_UUID}`;

    const response = await axios.post(
      "https://api.calendly.com/webhook_subscriptions",
      {
        url: webhookUrl,
        events: ["invitee.created", "invitee.canceled"],
        organization: orgUri,
        scope: "organization", // required field
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Webhook registered successfully:", response.data);
  } catch (err: any) {
    console.error("Error registering webhook:", err.response?.data || err.message);
  }
}

registerWebhook();
