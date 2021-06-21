# Terraform Plan GitHub Action
Runs the following commands in order:
```sh
terraform init
terraform validate
terraform fmt --check
terraform plan
```

# Examples
```yaml
# Run Terraform plan and add a comment with infrastructure changes, if they exist, on the PR
- name: Terraform plan
  uses: patheard/action-terraform-plan
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}


# Run on a sub project folder
- name: Terraform plan
  uses: patheard/action-terraform-plan
  with:
    directory: ./infra
    github-token: ${{ secrets.GITHUB_TOKEN }} 

# Run Terraform plan with no PR comment
- name: Terraform plan
  uses: patheard/action-terraform-plan
  with:
    add-comment: false   
```

# TODO
- [ ] Add a comment to the PR with the changes and plan
- [x] Restructure project into proper action
- [ ] Add tests
