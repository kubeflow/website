+++
title = "Access the Dashboard"
description = "How to access the Kubeflow Central Dashboard via the Istio Gateway"
weight = 15
+++

## How to access the Kubeflow Central Dashboard?

To access the Kubeflow central dashboard, you need to connect to the [Istio Gateway](https://istio.io/docs/concepts/traffic-management/#gateways) that provides access to the Kubeflow [service mesh](https://istio.io/docs/concepts/what-is-istio/#what-is-a-service-mesh).
How you access the Istio gateway varies depending on how you've configured it.

## Packaged Distributions

Each [packaged distribution of Kubeflow](/docs/started/installing-kubeflow/#packaged-distributions) will have its own way of accessing the central dashboard.

For more information, please see the documentation of the distribution you are using.

## Raw Manifests

If you are using the default [Kubeflow Manifests](/docs/started/installing-kubeflow/#kubeflow-manifests), you may access the Istio gateway with `kubectl` port-forwarding or another method.

### kubectl port-forwarding

To access the central dashboard using `kubectl` port-forwarding:

1. [Install `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/), if you haven't already done so.
2. Use the following command to set up port forwarding on your local machine:

    ```bash
    export ISTIO_NAMESPACE=istio-system
    kubectl port-forward svc/istio-ingressgateway -n ${ISTIO_NAMESPACE} 8080:80
    ```

3. Open a browser and navigate to: [http://localhost:8080](http://localhost:8080)
4. If you have not changed the default username and password, you may log in with:
    - Username: `user@example.com`
    - Password: `12341234`

## Next steps

- Learn about [Profiles and Namespaces](/docs/components/central-dash/profiles/).