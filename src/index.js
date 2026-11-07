import express from "express";
import crypto from "crypto";
import { App } from "@octokit/app";

const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const githubApp = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
});

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
  async (req, res) => {
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

    if (event !== "pull_request") {
      return res.status(200).json({
        received: true,
        event
      });
    }

    const supportedActions = ["opened", "synchronize", "reopened"];

    if (!supportedActions.includes(payload.action)) {
      return res.status(200).json({
        received: true,
        event,
        action: payload.action
      });
    }

    try {
      const installationId = payload.installation?.id;
      const repository = payload.repository;
      const pullRequest = payload.pull_request;

      if (!installationId || !repository || !pullRequest?.head?.sha) {
        return res.status(400).send("Missing pull request information");
      }

      const octokit =
        await githubApp.getInstallationOctokit(installationId);

      await octokit.rest.checks.create({
        owner: repository.owner.login,
        repo: repository.name,
        name: "TinyToast",
        head_sha: pullRequest.head.sha,
        status: "completed",
        conclusion: "success",
        output: {
          title: "TinyToast connected",
          summary:
            "TinyToast successfully received this pull request and connected to the GitHub Checks API. Automated code validation will be added next."
        }
      });

      console.log("TinyToast check created for PR:", pullRequest.number);

      return res.status(200).json({
        received: true,
        event,
        check_created: true
      });

    } catch (error) {
      console.error("TinyToast error:", error);
      return res.status(500).send("Failed to create GitHub check");
    }
  }
);

app.listen(PORT, () => {
  console.log(`TinyToast running on port ${PORT}`);
});
