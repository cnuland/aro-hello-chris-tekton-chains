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

* This demo uses quay as the repository to test the tekton chain OCI functionality. You will need to create a repository credential secret, even if your image is public. The buildah `Task` will use the following secret format. Highly recommend using a quay robot account instead of your actual quay username/password. This secret needs to be created on both the `hello-chris` and `kyverno` namespaces.

```
oc create secret docker-registry dockerconfigjson \
  --docker-server=quay.io \
  --docker-username=<your robot username> \
  --docker-password=<your robot password> \
  --docker-email=test@acme.com 
  ```