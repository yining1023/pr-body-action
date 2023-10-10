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
    let elements = body.match(/\[.*\]\(.*\)/g);
    if (elements != null && elements.length > 0) {
      for (el of elements) {
        let txt = el.match(/\[(.*)\]/)[1]; //get only the txt
        let url = el.match(/\]\((.*)\)/)[1]; //get only the link
        body = body.replace(el, "<" + url + "|" + txt + ">");
      }
    }
    body = body.replaceAll("- ", "• ");
    body = body.replaceAll("**", "*");
    const output = {
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "text",
                  text: body,
                },
              ],
            },
          ],
        },
      ],
    };
    core.setOutput("body", JSON.stringify(output));
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
