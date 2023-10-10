const core = require("@actions/core");
const github = require("@actions/github");

const run = async () => {
  try {
    const prNumber = core.getInput("pr-number");

    const githubToken = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(githubToken);
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });
    let body = pr.body;

    // Ensure <> don't mess with links
    body = body.replaceAll("<", "‹");
    body = body.replaceAll(">", "›");

    let elements = body.match(/\[.*\]\(.*\)/g);
    if (elements != null && elements.length > 0) {
      for (el of elements) {
        let txt = el.match(/\[(.*)\]/)[1]; //get only the txt
        let url = el.match(/\]\((.*)\)/)[1]; //get only the link
        body = body.replace(el, "<" + url.trim() + "|" + txt.trim() + ">");
      }
    }
    body = body.replaceAll("^- ", "• ");
    body = body.replaceAll("**", "*");

    // Split body into chunks of so that we don't reach the Slack API limit of 3000 characters
    const bodyChunks = body.split("\n\n");
    const output = {
      blocks: [],
    };
    for (let i = 0; i < bodyChunks.length; i++) {
      output.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: bodyChunks[i],
        },
      });
    }

    core.setOutput("body", JSON.stringify(output));
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
