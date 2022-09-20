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
    const body = pr.body;
    console.log("body", typeof body, body, body.replace(/\n|\r/g, ""));
    core.setOutput("body", body.replace(/\n|\r/g, ""));
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
