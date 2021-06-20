const core = require('@actions/core');
const proc = require('child_process');

const execCommand = command => {
  const result = proc.execSync(command);
  console.log(result.toString('utf8'));
};

try {

  console.log(`GitHub Token: ${process.env.github_token}`)

  // Run Terraform commands
  const commands = [
    'terraform version',
    'terraform init',
    'terraform validate',
    'terraform fmt --check',
    'terraform plan'
  ];

  for(let c of commands){
    execCommand(c)
  }

  // Open Policy Agent to check results


  // Comment on PR if changes or errors


} catch (error) {
  core.setFailed(error.message);
}