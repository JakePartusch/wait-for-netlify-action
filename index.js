const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const waitForUrl = async (url, MAX_TIMEOUT, { headers }) => {
  const iterations = MAX_TIMEOUT / 2;
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url, { headers });
      return;
    } catch (e) {
      console.log("Url unavailable, retrying...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`);
};

const run = async () => {
  try {
    const PR_NUMBER = github.context.payload.number;
    // Netlify only uses 24 characters of the sha for the deploy preview
    const SHA = github.context.sha.substring(0, 24);

    const MAX_TIMEOUT = Number(core.getInput("max_timeout")) || 60;
    const useCommitPreview = Boolean(core.getInput('use_commit_preview') || false);
    const siteName = core.getInput("site_name");

    if (!useCommitPreview && !PR_NUMBER) {
      core.setFailed(
        "Action must be run in conjunction with the `pull_request` event"
      );
    }
    if (!siteName) {
      core.setFailed("Required field `site_name` was not provided");
    }

    let url = `https://deploy-preview-${PR_NUMBER}--${siteName}.netlify.app`;
    if (useCommitPreview) {
      url = `https://${SHA}--${siteName}.netlify.app`;
    }

    core.setOutput("url", url);
    const extraHeaders = core.getInput("request_headers");
    const headers = !extraHeaders ? {} : JSON.parse(extraHeaders)
    console.log(`Waiting for a 200 from: ${url}`);
    await waitForUrl(url, MAX_TIMEOUT, {
      headers,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
