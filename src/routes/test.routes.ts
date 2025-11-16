import { Router } from "express";
import WebhookEvent from "../models/WebhookEvent";

const router = Router();

router.post("/add-event", async (req, res) => {
  try {
    const { event, payload } = req.body;
    const doc = await WebhookEvent.create({ event, payload, receivedAt: new Date() });
    res.json({ success: true, saved: doc });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to add event", details: err.message });
  }
});

export default router;
