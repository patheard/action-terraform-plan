const core = require('@actions/core');
const github = require('@actions/github');
const proc = require('child_process');

const execCommand = command => {
  const result = proc.execSync(command);
  console.log(result.toString('utf8'));
};

const addComment = (octokit, context, comment) => {
  octokit.issues.createComment({
    ...context.repo,
    body: comment
  });
};

try {

  const token = core.getInput('github-token', {required: true});

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
  const octokit = github.getOctokit(token, opts)
  const context = github.context;  
  const comment = `# Comment heading
Comment body
\`\`\`sh
# another comment
ls -la
\`\`\`
`;
  addComment(octokit, context, comment);

} catch (error) {
  core.setFailed(error.message);
}