
# TinyToast 🍞

**Small checks. Better pull requests.**

TinyToast is a lightweight GitHub App designed to help developers catch issues in pull requests before merging.

It automatically checks pull request activity and reports validation results directly on GitHub.

## Features

- GitHub App integration
- Automatic pull request event detection
- Pull request validation
- GitHub Check Run reporting
- Clear pass/fail results

## How It Works

1. A developer opens or updates a pull request.
2. GitHub sends a webhook event to TinyToast.
3. TinyToast processes the event and performs its checks.
4. Results are reported back to GitHub.
5. Developers can review the result before merging.

## Project Status

<badge color="warning">Early Development</badge>

TinyToast is currently under development. The initial focus is on webhook integration, pull request detection, and basic validation.

## Technology Stack

- Node.js
- Express.js
- GitHub Apps API
- GitHub Webhooks
- Render


Developed by [Edge Robotics Studio](https://github.com/edgeroboticsstudio).

