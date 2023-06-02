# Hello Chris Tekton Chains

## Notes
* You will need to create a git secret so that the git-clone action can access the repo
```
oc create secret generic git-ssh --from-literal=username=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 --from-literal=password=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
```