const core = require('@actions/core');
const github = require('@actions/github');
const proc = require('child_process');

const addComment = (octokit, context, title, results) => {

  const comment = `## ${title}
**${ result.fmt.isSuccess ?  '✅' : '❌' } &nbsp; Terraform Format:** \`${ result.fmt.isSuccess ? 'success' : 'failed' }\`
**${ result.plan.isSuccess ? '✅' : '❌' } &nbsp; Terraform Plan:** \`${ result.plan.isSuccess ?  'success' : 'failed' }\`
<details>
<summary>Show plan</summary>

\`\`\`terraform
${results.show.output}
\`\`\`
</details>`;

  octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: context.payload.pull_request.number,
    body: comment
  });
};

const run = () => {
  const directory = core.getInput('directory');
  const isComment = core.getInput('comment') === 'true';
  const isTerragrunt = core.getInput('terragrunt') === 'true';
  const binary = isTerragrunt ? 'terragrunt' : 'terraform';

  const commands = [
    {key: 'init',     exec: `${binary} init`},
    {key: 'validate', exec: `${binary} validate`},
    {key: 'fmt',      exec: `${binary} fmt --check`},
    {key: 'plan',     exec: `${binary} plan -json -out=plan.tfplan`},
    {key: 'show',     exec: `${binary} show plan.tfplan -no-color`},
  ];
  let results = {};
  let isError = false;

  for(let command of commands){
    let output, exitCode = 0;

    try {
      console.log('Running: \x1b[36m%s\x1b[0m\n', command.exec);
      output = proc.execSync(command.exec, {cwd: directory}).toString('utf8');
      console.log(output);
    } catch (error) {
      isError = true;
      exitCode = error.exitCode;
      output = error.message.toString('utf8');
    }

    results[command.key] = {
      isSuccess: exitCode === 0,
      output: output
    }
  }

  // Comment on PR if changes or errors
  const isChanges = results.plan.output.indexOf('"type":"planned_change"') > -1;
  if(isComment && isChanges){
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);
    addComment(octokit, github.context, core.getInput('comment-title'), results);
  }

  if(isError){
    core.setFailed("Terraform plan failed");
  }
}

run();
