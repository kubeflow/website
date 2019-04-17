+++
title = "Submit a Docker Image to Container Registry"
description = "Building docker images from Jupyter Notebook on GCP"
weight = 50
+++

If using Jupyter Notebooks on GKE, you can submit docker image builds to Cloud Build which builds your docker images and pushes them to Google Container Registry.

Activate the attached service account using

```
!gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```

If you have a Dockerfile in your current directory, you can submit a build using

```
!gcloud container builds submit --tag gcr.io/myproject/myimage:tag .
```

Advanced build documentation for docker images is available [here](https://cloud.google.com/cloud-build/docs/quickstart-docker)