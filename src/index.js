import express from "express";
import crypto from "crypto";

const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.get("/", (req, res) => {
  res.status(200).send("TinyToast is running!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TinyToast"
  });
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-hub-signature-256"];

    if (!WEBHOOK_SECRET) {
      return res.status(500).send("Webhook secret not configured");
    }

    if (!signature || !Buffer.isBuffer(req.body)) {
      return res.status(401).send("Invalid webhook request");
    }

    const expectedSignature =
      "sha256=" +
      crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(req.body)
        .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);

    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.headers["x-github-event"];

    let payload;

    try {
      payload = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).send("Invalid JSON");
    }

    if (event === "pull_request") {
      console.log("Pull request event:", payload.action);
      console.log("Repository:", payload.repository?.full_name);
      console.log("PR number:", payload.number);

      const supportedActions = [
        "opened",
        "synchronize",
        "reopened"
      ];

      if (supportedActions.includes(payload.action)) {
        console.log("TinyToast received a PR to check.");
      }
    }

    return res.status(200).json({
      received: true,
      event
    });
  }
);

app.listen(PORT, () => {
  console.log(`TinyToast running on port ${PORT}`);
});
