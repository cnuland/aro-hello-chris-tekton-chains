# Hello Chris Tekton Chains

## Install
Run the kustomize file that is in the `cluster-primer` directory using the following oc command
```
oc apply -k cluster-primer
```

## Notes
* You may need to create a git secret so that the git-clone action can access the repo. The password must match a generated dev token from github. The `Task` requires the secret to be there even if the repo is public.
```
oc create secret generic git-ssh --from-literal=username=<username>
--from-literal=password=<dev_token>
```