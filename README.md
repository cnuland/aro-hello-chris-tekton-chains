# Hello Chris Tekton Chains

## Notes
* You will need to create a git secret so that the git-clone action can access the repo. The Username must match your dev token from github, and the password can be left blank. The `Task` requires the secret to be there even if the repo is public.
```
oc create secret generic git-ssh --from-literal=username=<dev_token>
--from-literal=password=
```