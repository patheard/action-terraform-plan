const core = require('@actions/core');
const github = require('@actions/github');
const proc = require('child_process');

const execCommand = (command, workingDir) => {
  const result = proc.execSync(command, {cwd: workingDir});
  console.log(result.toString('utf8'));
};

const removeIndent = str => ('' + str).replace(/(\n)\s+/g, '$1');
const addComment = (octokit, context) => {
  const comment = removeIndent
    `# Comment heading
    Comment body
    \`\`\`sh
    # another comment
    ls -la
    \`\`\`
    `;

  octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: context.payload.pull_request.number,
    body: comment
  });
};

try {

  // Run Terraform commands
  const commands = [
    'terraform init',
    'terraform validate',
    'terraform fmt --check',
    'terraform plan -json -out=plan.tfplan',
    'terraform show plan.tfplan'
  ];

  const dir = core.getInput('directory');
  for(let command of commands){
    execCommand(command, dir);
  }

  // Comment on PR if changes or errors
  if(core.getInput('add-comment') === 'true'){
    const token = core.getInput('github-token');  
    const octokit = github.getOctokit(token);
    addComment(octokit, github.context);
  }

} catch (error) {
  core.setFailed(error.message);
}