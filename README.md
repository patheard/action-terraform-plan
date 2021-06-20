# Terraform Plan GitHub Action
Runs the following commands in order:
```sh
terraform version
terraform init
terraform validate
terraform fmt --check
```

# TODO
- [ ] Use Open Policy Agent to get a count of all changes
- [ ] Add a comment to the PR with the changes and plan
- [ ] Restructure project into proper action
- [ ] Add tests
