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

* Install [cosign](https://docs.sigstore.dev/cosign/installation/) on your machine to generate the necessary keypairs.

1) generate keypair, where `NAMESPACE` is set to the namespace where the Tekton pipeline will run
```
cosign generate-key-pair k8s://${NAMESPACE}/cosign
```

2) Retrieve the private key

```
kubectl get secret -n ${NAMESPACE} cosign -o jsonpath='{.data.cosign\.key}' | base64 -d > cosign.key
```

* You will need to add your own public key from the above step to the `ClusterPolicy` found in the kyverno operator directory [image-check.yaml](/k8s/operators/kyverno/base/image-check.yaml)

* Follow the instructions for adding an OCI repository to Tekton Chains
[here](https://docs.openshift.com/container-platform/4.10/cicd/pipelines/using-tekton-chains-for-openshift-pipelines-supply-chain-security.html#creating-and-verifying-task-run-signatures-without-any-additional-authentication_using-tekton-chains-for-openshift-pipelines-supply-chain-security)