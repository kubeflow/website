+++
title = "kustomize"
description = "Information about kustomize as used in Kubeflow"
weight = 20
+++

Kubeflow makes use of [kustomize](https://kustomize.io/) to help customize YAML
configurations.

## Installing kustomize

Make sure you have the minimum required version of kustomize:
**{{% kustomize-min-version %}}** or later.

The simplest way to install kustomize is to run `go get sigs.k8s.io/kustomize`.

If you prefer installing it from source follow the steps below to install
kustomize:

1. Follow the [kustomize installation
   guide](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/INSTALL.md),
   choosing the relevant options for your operating system. For example, if
   you're on Linux:

    * Set some variables for the operating system:

        ```
        export opsys=linux
        ```

    * Download the kustomize binary:

        ```
        curl -s https://api.github.com/repos/kubernetes-sigs/kustomize/releases/latest |\
        grep browser_download |\
        grep $opsys |\
        cut -d '"' -f 4 |\
        xargs curl -O -L
        ```

    * Move the binary:

        ```
        mkdir -p ${HOME}/bin
        mv kustomize_*_${opsys}_amd64 ${HOME}/bin/kustomize
        chmod u+x ${HOME}/bin/kustomize
        ```

1. Include the `kustomize` command in your path:

      ```
      export PATH=$PATH:${HOME}/bin/kustomize
      ```

## More about kustomize

kustomize lets you customize raw, template-free YAML files for multiple
purposes, leaving the original YAML untouched and usable as is.

kustomize directories can be built and applied using
`kustomize build <kustomization_directory> | kubectl apply -f -`.

The [kustomize manifests repo](https://github.com/kubeflow/manifests) contains
kustomize targets, each with a `base` directory. You can use kustomize to
generate YAML output and pass it to the kubeflow CLI, `kfctl`.

Some useful kustomize terms:

* **kustomization:** Refers to a kustomization.yaml file.

* **resource:** Any valid YAML file that defines an object with a kind and a
metadata/name field.

* **patch:** General instructions to modify a resource.

* **base:** A combination of a kustomization and resource(s). Bases can be
referred to by other kustomizations.

* **overlay:** A combination of a kustomization that refers to a base, and a
patch. An overlay may have multiple bases.

* **variant:** The outcome of applying an overlay to a base.

Read more about kustomize in the
[kustomize documentation](https://github.com/kubernetes-sigs/kustomize/tree/master/docs).
