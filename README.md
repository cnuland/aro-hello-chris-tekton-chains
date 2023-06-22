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

1)
```
oc create secret docker-registry dockerconfigjson \
  --docker-server=quay.io \
  --docker-username=<your robot username> \
  --docker-password=<your robot password> \
  --docker-email=test@acme.com
  ```

2)
```
oc patch serviceaccount pipeline -p "{\"imagePullSecrets\": [{\"name\": \"dockerconfigjson\"}]}"
```

* Modify Tekton Chains Config
Make sure to modify the the tekton chains config found in the openshift-pipelines namespace.
`oc edit cm chains-config -n openshift-pipelines'

```
data:
  artifacts.oci.signer: cosign
  artifacts.taskrun.format: in-toto
  artifacts.taskrun.storage: oci
  transparency.enabled: "true"
```

delete the tekton-chains-controller pod found in openshift-pipelines namespace
```
oc get pods -n openshift-pipelines | grep chains
oc delete pod <pod name> -n openshift-pipelines
```

* Install [cosign](https://docs.sigstore.dev/cosign/installation/) on your machine to generate the necessary keypairs.

1) generate keypair. IMPORTANT - the secret generated below is not in the correct format and needs to be modified before Chains can use it.

```
 cosign generate-key-pair k8s://openshift-pipelines/signing-secrets
```

2) Retrieve the private key

```
oc get secret -n ${NAMESPACE} signing-secrets -o jsonpath='{.data.cosign\.key}' | base64 -d > cosign.key
```

3) The cosign.key file needs to be modified so that the ENCRYPTION is of type COSIGN and not SIGSTORE

4) delete the existing private key `oc delete secret signing-secrets -n openshift-pipelines`

5) Create the secret with the correct formatting
```
oc create secret generic signing-secrets --from-file=cosign.key=cosign.key --from-literal=cosign.password=<your cosign password> --from-literal=cosign.pub=cosign.pub -n openshift-pipelines
```

* Change the configs for Tekton Chains to use the above steps secret

```
$ oc patch configmap chains-config -n openshift-pipelines -p='{"data":{"artifacts.taskrun.format": "in-toto"}}'

$ oc patch configmap chains-config -n openshift-pipelines -p='{"data":{"artifacts.taskrun.storage": "oci"}}'

$ oc patch configmap chains-config -n openshift-pipelines -p='{"data":{"transparency.enabled": "true"}}'
```

Delete the tekton chains controller `Pod` found in the openshift-pipelines so that the new configurations can be applied.

`NOTE` I had an error where the secret was not correctly picked up by the tekton-chains `Pod` after restarting the `Pod`. I had to bring the tekton-chains `Deployment` down to 0 and then back up to 1.
```
oc get pods | grep tekton-chains
oc delete pod <pod-name>
```

* You will need to add the public key from the above step to the `ClusterPolicy` found in the kyverno operator directory [image-check.yaml](/k8s/operators/kyverno/base/image-check.yaml)

* Follow the instructions for adding an OCI repository to Tekton Chains
[here](https://docs.openshift.com/container-platform/4.10/cicd/pipelines/using-tekton-chains-for-openshift-pipelines-supply-chain-security.html#creating-and-verifying-task-run-signatures-without-any-additional-authentication_using-tekton-chains-for-openshift-pipelines-supply-chain-security)