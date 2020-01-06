const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const waitForUrl = async url => {
  for (let i = 0; i < 5; i++) {
    try {
      await axios.get(url);
    } catch (e) {
      await new Promise(r => setTimeout(r, 5000));
      if (i === 4) {
        core.setFailed(`Timeout reached: Unable to connect to ${url}`);
      }
    }
  }
};

const run = async () => {
  try {
    const PR_NUMBER = github.context.payload.number;
    const siteName = core.getInput("site_name");
    const url = `https://deploy-preview-${PR_NUMBER}--${siteName}.netlify.com`;
    console.log(`Waiting for a 200 from: ${url}`);
    await waitForUrl(url);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
