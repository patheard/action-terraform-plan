const core = require('@actions/core');
const github = require('@actions/github');
const proc = require('child_process');

const addComment = (octokit, context, title, results) => {
  const comment =
`# ${title}
<details>
<summary>Show plan</summary>
\`\`\`terraform
${results.show}
\`\`\`
</details>
`;

  octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: context.payload.pull_request.number,
    body: comment
  });
};

try {

  const directory = core.getInput('directory');
  const commands = [
    {key: 'init',     exec: 'terraform init'},
    {key: 'validate', exec: 'terraform validate'},
    {key: 'fmt',      exec: 'terraform fmt --check'},
    {key: 'plan',     exec: 'terraform plan -json -out=plan.tfplan'},
    {key: 'show',     exec: 'terraform show plan.tfplan -no-color'},
  ];
  let results = {};

  for(let command of commands){
    results[command.key] = proc.execSync(command.exec, {cwd: directory}).toString('utf8')
    console.log(results[command.key]);  
  }

  // Comment on PR if changes or errors
  if(core.getInput('comment') === 'true'){
    const token = core.getInput('github-token');  
    const octokit = github.getOctokit(token);
    addComment(octokit, github.context, core.getInput('title'), results);
  }

} catch (error) {
  core.setFailed(error.message);
}