import { Router } from "express";
import axios from "axios";
import User from "../models/User";
import WebhookEvent from "../models/WebhookEvent";

const router = Router();

// Live fetch from Calendly API
router.get("/", async (req, res) => {
  try {
    const userDoc = await User.findOne({ userId: "demo-user" });
    if (!userDoc) {
      return res.status(404).json({ error: "User URI not found in DB" });
    }

    const response = await axios.get(
      `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(
        userDoc.uri
      )}`,
      {
        headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` },
      }
    );

    res.json(response.data);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch events", details: err.message });
  }
});

// Stored events from MongoDB (WebhookEvent)
router.get("/stored", async (req, res) => {
  try {
    const events = await WebhookEvent.find().sort({ receivedAt: -1 });
    res.json({ collection: events });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch stored events", details: err.message });
  }
});

// Update a Calendly scheduled event via API (rescheduling)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  try {
    const calendlyRes = await axios.patch(
      `https://api.calendly.com/scheduled_events/${id}`,
      { start_time, end_time },
      { headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` } }
    );

    // Keep Mongo in sync if we have a stored record
    await WebhookEvent.updateOne(
      { "payload.event.uri": `https://api.calendly.com/scheduled_events/${id}` },
      {
        $set: {
          "payload.event.start_time": start_time,
          "payload.event.end_time": end_time,
        },
      }
    );

    res.json(calendlyRes.data);
  } catch (err) {
    console.error("Error updating Calendly event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

export default router;
