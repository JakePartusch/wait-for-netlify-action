const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

try {
  const url = core.getInput("url");
  console.log(`Waiting for a 200 from: ${url}`);

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
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
