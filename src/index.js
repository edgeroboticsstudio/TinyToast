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
  res.send("TinyToast is running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "TinyToast" });
});

// Pull request validation
function validatePullRequest(pr) {
  const title = (pr.title || "").trim();
  const body = (pr.body || "").trim();
  const files = Number(pr.changed_files || 0);

  const checks = [
    {
      name: "PR Title",
      passed: title.length >= 5,
      message: "Title must contain at least 5 characters.",
    },
    {
      name: "PR Description",
      passed: body.length >= 20,
      message: "Description must contain at least 20 characters.",
    },
    {
      name: "Linked Issue",
      passed: /#\d+/.test(body),
      message: "Add a linked issue reference, e.g. Fixes #123.",
    },
  ];

  const failed = checks.filter((c) => !c.passed);
  const sizeWarning = files > 20;

  const summary = [
    failed.length === 0
      ? "All required TinyToast validations passed."
      : "Some required validations failed.",
    "",
    ...checks.map(
      (c) => `${c.passed ? "✅" : "❌"} **${c.name}:** ${
        c.passed ? "Passed" : c.message
      }`
    ),
    "",
    sizeWarning
      ? `⚠️ Large PR: ${files} files changed. Recommended maximum: 20.`
      : `PR size: ${files} files. Passed.`,
  ].join("\n");

  return {
    passed: failed.length === 0,
    summary,
  };
}

// GitHub webhook
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["x-hub-signature-256"];

    if (!WEBHOOK_SECRET) {
      return res.status(500).send("Webhook secret not configured");
    }

    if (!signature || !Buffer.isBuffer(req.body)) {
      return res.status(401).send("Invalid request");
    }

    const expected =
      "sha256=" +
      crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(req.body)
        .digest("hex");

    const receivedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return res.status(401).send("Invalid signature");
    }

    let payload;

    try {
      payload = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).send("Invalid JSON");
    }

    const event = req.headers["x-github-event"];

    if (event !== "pull_request") {
      return res.json({ received: true, event });
    }

    const actions = [
      "opened",
      "synchronize",
      "reopened",
      "edited",
      "ready_for_review",
    ];

    if (!actions.includes(payload.action)) {
      return res.json({
        received: true,
        action: payload.action,
      });
    }

    try {
      const installationId = payload.installation?.id;
      const repository = payload.repository;
      const pr = payload.pull_request;

      if (!installationId || !repository || !pr?.head?.sha) {
        return res.status(400).send("Missing PR information");
      }

      const octokit =
        await githubApp.getInstallationOctokit(installationId);

      const result = validatePullRequest(pr);

      await octokit.request(
        "POST /repos/{owner}/{repo}/check-runs",
        {
          owner: repository.owner.login,
          repo: repository.name,
          name: "TinyToast",
          head_sha: pr.head.sha,
          status: "completed",
          conclusion: result.passed ? "success" : "failure",
          output: {
            title: result.passed
              ? "TinyToast validation passed"
              : "TinyToast validation failed",
            summary: result.summary,
          },
        }
      );

      console.log(
        `TinyToast ${result.passed ? "PASSED" : "FAILED"}: PR #${pr.number}`
      );

      return res.json({
        received: true,
        check_created: true,
        conclusion: result.passed ? "success" : "failure",
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
