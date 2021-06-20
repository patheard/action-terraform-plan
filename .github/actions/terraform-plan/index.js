const core = require('@actions/core');
const github = require('@actions/github');
const proc = require('child_process');

const execCommand = command => {
  const result = proc.execSync(command);
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
    'terraform version',
    'terraform init',
    'terraform validate',
    'terraform fmt --check',
    'terraform plan'
  ];

  for(let c of commands){
    execCommand(c);
  }

  // Open Policy Agent to check results


  // Comment on PR if changes or errors
  const token = core.getInput('github-token', {required: true});  
  const octokit = github.getOctokit(token);
  addComment(octokit, github.context);

} catch (error) {
  core.setFailed(error.message);
}