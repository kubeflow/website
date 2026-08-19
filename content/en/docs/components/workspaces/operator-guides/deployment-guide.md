---
title: Deployment Guide
description: How to deploy Kubeflow Workspaces
weight: 10
---

{{< workspaces-beta-notice >}}

This guide describes how to deploy Kubeflow Workspaces (Kubeflow Notebooks v2). Choose the
installation method that matches your environment.

## Install Kubeflow Workspaces standalone

{{% alert title="Coming soon" color="info" %}}
Standalone installation will be included in a future release, subscribe to the related epic [kubeflow/notebooks#1336](https://github.com/kubeflow/notebooks/issues/1336) for more information.
{{% /alert %}}

<!-- TODO: document standalone install once standalone mode is supported -->

## Install Kubeflow Workspaces alongside the Kubeflow Community Distribution

### Step 1: Install the Kubeflow Community Distribution

Install the [Kubeflow Community Distribution](/docs/started/installing-kubeflow/). We recommend
using the **latest** (currently {{% kf-latest-version %}}) release, though older releases (starting
from 1.10.0) will most likely also work.

If you already have a working install of the KCD on your test cluster you can proceed with [Step 2](/docs/components/workspaces/operator-guides/deployment-guide/#step-2-deploy-the-kubeflow-workspaces-components).

```
git clone --branch {{% kf-latest-version %}} https://github.com/kubeflow/community-distribution.git
[...]
cd community-distribution
git describe --tags
{{% kf-latest-version %}}
```

See the community distributions [install
instructions](https://github.com/kubeflow/community-distribution#install-with-a-single-command) for
more details on how to proceed for the install itself.

After you finished the installation you can start the port-forward and log in
with the [default
credentials](https://github.com/kubeflow/community-distribution#dex):

```
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

<!-- TODO: point out which KCD resources can be omitted/which are strictly needed? -->

### Step 2: Deploy the Kubeflow Workspaces components

The Workspaces manifests live in the [`kubeflow/notebooks`](https://github.com/kubeflow/notebooks)
repository. We reference them directly with Kustomize's remote-base support, so this step does
**not** depend on the Community Distribution manifests being checked out locally.

Pin the deployment to a released **v2** tag so the install is reproducible. This guide targets `{{%
kf-workspaces-version %}}` and the commands below default to it. To use a different release, export
`KUBEFLOW_WORKSPACE_TAG` (find the latest tag on the [releases
page](https://github.com/kubeflow/notebooks/releases)):

```bash
# Optional: override the pinned tag (defaults to {{% kf-workspaces-version %}}).
export KUBEFLOW_WORKSPACE_TAG={{% kf-workspaces-version %}}
```

Create a self-contained `kustomization.yaml` that pulls the backend, controller, and frontend
overlays from the pinned tag:

```bash
cd $(mktemp -d)
cat <<EOF > kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# --> DANGER: Workspaces (Notebooks v2) is still pre-GA <--
#
# !!! DO NOT DEPLOY THIS TO A PRODUCTION CLUSTER !!!
#
# See this for the current status:
# https://www.kubeflow.org/docs/components/notebooks/notebooks-v2-pre-ga-banner
resources:
- "github.com/kubeflow/notebooks//workspaces/backend/manifests/kustomize/overlays/istio?ref=${KUBEFLOW_WORKSPACE_TAG:-{{% kf-workspaces-version %}}}"
- "github.com/kubeflow/notebooks//workspaces/controller/manifests/kustomize/overlays/istio?ref=${KUBEFLOW_WORKSPACE_TAG:-{{% kf-workspaces-version %}}}"
- "github.com/kubeflow/notebooks//workspaces/frontend/manifests/kustomize/overlays/istio?ref=${KUBEFLOW_WORKSPACE_TAG:-{{% kf-workspaces-version %}}}"
EOF
kubectl apply --kustomize .
```

The manifests install into the `kubeflow-workspaces` namespace. Wait for the components to become
ready:

```bash
kubectl wait --for=condition=Available deployment --all --namespace kubeflow-workspaces --timeout=300s
```

### Step 3: Add the Kubeflow Workspaces tab to the Central Dashboard

In order to integrate with the [Central Dashboard](/docs/components/central-dash/) we add an entry
to the dashboard's sidebar. Unlike the already installed components, this component is not part of
the upstream `kubeflow/notebooks` manifests, it is just a patch to the dashboard's
`dashboard-config` ConfigMap, which the Community Distribution deploys in the `kubeflow` namespace.

The Community Distribution already ships a `dashboard-config` that includes the `Notebooks v2`
(Workspaces) sidebar entries. The simplest option is to replace the ConfigMap with that version:

```bash
kubectl apply --namespace kubeflow --filename "https://raw.githubusercontent.com/kubeflow/community-distribution/{{% kf-latest-version %}}/applications/workspaces/components/centraldashboard/centraldashboard-config.yaml"
```

This overwrites the **entire** sidebar with the Community Distribution defaults for that release. If
you run a different release or have customized the dashboard menu, use the surgical patch below
instead, which only inserts the `Notebooks v2` section and leaves everything else untouched:

<details>

<summary>Click to view dynamic patch command</summary>

This command just adds the Notebooks v2 entry after the Notebooks entry:

```bash
kubectl get configmap dashboard-config --namespace kubeflow -o jsonpath='{.data.links}' \
  | jq -c '
      ({ icon: "book", text: "Notebooks v2", type: "section",
         items: [ { type: "item", link: "/workspaces/", text: "Workspaces" },
                  { type: "item", link: "/workspaces/workspacekinds/", text: "WorkspaceKinds" } ] }) as $section
      | { data: { links: ((.menuLinks |= ( if any(.[]; .text == $section.text) then . else (map(.text == "Notebooks") | index(true)) as $i | if $i == null then . + [$section] else .[0:$i+1] + [$section] + .[$i+1:] end end)) | tojson) } }' \
  | kubectl patch configmap dashboard-config --namespace kubeflow --type merge --patch-file /dev/stdin
```

</details>

<!-- TODO: Should we also explain how admins can get access to the WorkspaceKinds Page? -->

### Step 4: Enable a StorageClass for Workspaces

Workspaces provision their home and data volumes from a `StorageClass`. The backend only offers
users the StorageClasses that are explicitly opted in with the `notebooks.kubeflow.org/can-use=true`
label, so you must enable at least one.

The example below uses `standard`, the default StorageClass on a [kind](https://kind.sigs.k8s.io/)
cluster, substitute the name of a StorageClass that exists in your cluster (`kubectl get
storageclass`):

```bash
# Allow Workspaces to use this StorageClass.
kubectl label storageclass standard \
  "notebooks.kubeflow.org/can-use=true" \
  --overwrite

# Optional: give it a friendly name and description shown in the UI.
kubectl annotate storageclass standard \
  "notebooks.kubeflow.org/display-name=Standard (Local Path)" \
  "notebooks.kubeflow.org/description=Local path provisioner for development. Data is stored on the node and not replicated." \
  --overwrite
```

### Step 5: Create WorkspaceKinds

**Concepts**:

- A **`WorkspaceKind`** is an administrator-defined template that describes an available
  environment: its base images, available resources and pod configuration.
- Users create a **`Workspace`** from a `WorkspaceKind` via a guided setup in the Workspaces
  Frontend.

Start from the upstream samples, which include ready-to-use `WorkspaceKind` definitions and adjust
them for your usecase and cluster resources:

- [JupyterLab](https://github.com/kubeflow/notebooks/blob/{{% kf-workspaces-version %}}/workspaces/controller/manifests/kustomize/samples/codeserver_v1beta1_workspacekind.yaml) (contains a lot of comments/explanations)
- [VSCode (code-server)](https://github.com/kubeflow/notebooks/blob/{{% kf-workspaces-version %}}/workspaces/controller/manifests/kustomize/samples/codeserver_v1beta1_workspacekind.yaml)
- [RStudio](https://github.com/kubeflow/notebooks/blob/{{% kf-workspaces-version %}}/workspaces/controller/manifests/kustomize/samples/codeserver_v1beta1_workspacekind.yaml)

```bash
# Apply the sample WorkspaceKinds (and an example Workspace)
kubectl apply --kustomize "github.com/kubeflow/notebooks/workspaces/controller/manifests/kustomize/samples?ref=${KUBEFLOW_WORKSPACE_TAG:-{{% kf-workspaces-version %}}}"
```

<!-- TODO: Should we strip the WS & common resources from the samples? -->

Once at least one `WorkspaceKind` exists, users can create Workspaces from it through the
Central Dashboard.
