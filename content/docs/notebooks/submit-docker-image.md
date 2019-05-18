+++
title = "Build a Docker Image on GCP"
description = "Building Docker images from a Jupyter notebook and submitting them to Container Registry"
weight = 50
+++

If you're using a Jupyter notebook in Kubeflow on Google Cloud Platform 
(GCP), you can submit Docker image builds to 
[Cloud Build](https://cloud.google.com/cloud-build/docs/). Cloud Build builds 
the  Docker image and pushes it to 
[Google Container Registry](https://cloud.google.com/container-registry/docs/).

## Building a Docker image

Run the following command in a Jupyter notebook cell to activate the attached
service account:

```
!gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```

Run the 
[`gcloud builds submit`](https://cloud.google.com/sdk/gcloud/reference/builds/submit) command to submit a build. The following example assumes that your Dockerfile is in the current directory:

```
!gcloud builds submit --tag gcr.io/myproject/myimage:tag .
```

## A bit about authentication

Kubeflow assigns the `jupyter-notebook` service account to the Jupyter notebook
Pods.
The `${GOOGLE_APPLICATION_CREDENTIALS}` environment variable is pre-configured
in the notebook. Its value is a path that points to a JSON file containing a
[Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/).
The secret contains the credentials needed to authenticate as the notebook
service account within the cluster. To see the value of the environment
variable, enter the following command in a notebook cell:

```
!echo ${GOOGLE_APPLICATION_CREDENTIALS}
```

You should see a response similar to this:

```
/secrets/gcp-service-account-credentials/user-gcp-sa.json
```

## Next steps

* For more information about using Cloud Build to build Docker images, see the
[Cloud Build documentation](https://cloud.google.com/cloud-build/docs/quickstart-docker).
* See how to [deploy Kubeflow on GCP](/docs/gke/deploy/).