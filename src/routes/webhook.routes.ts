import { Router } from "express";
import WebhookEvent from "../models/WebhookEvent";

const router = Router();

// Calendly will POST webhook payloads here
router.post("/", async (req, res) => {
  try {
    const { event, payload } = req.body;
    

    if (!event || !payload) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    await WebhookEvent.create({
      event,
      payload,
      receivedAt: new Date(),
    });

    console.log("Webhook received:", event);
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Webhook handling failed:", err.message);
    res
      .status(500)
      .json({ error: "Webhook handling failed", details: err.message });
  }
});

export default router;
