import { Router } from "express";
import axios from "axios";

const router = Router();

// Register Calendly webhook subscription
router.post("/register-webhook", async (req, res) => {
  const { webhookUrl, orgUri, events } = req.body;

  if (!webhookUrl || !orgUri || !events || !Array.isArray(events)) {
    return res.status(400).json({
      error:
        "Provide webhookUrl, orgUri, and events (array) in request body.",
    });
  }

  try {
    const response = await axios.post(
      "https://api.calendly.com/webhook_subscriptions",
      {
        url: webhookUrl,            
        events,                     
        organization: orgUri,       
      },
      { headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` } }
    );

    res.json(response.data);
  } catch (err: any) {
    console.error("Error registering webhook:", err.message);
    res.status(500).json({ error: "Failed to register webhook" });
  }
});

// Optional: list subscriptions
router.get("/webhook-subscriptions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.calendly.com/webhook_subscriptions",
      { headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` } }
    );
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list subscriptions" });
  }
});

router.delete("/webhook-subscriptions/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    await axios.delete(
      `https://api.calendly.com/webhook_subscriptions/${uuid}`,
      { headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` } }
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete subscription" });
  }
});

export default router;
