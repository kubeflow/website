+++
title = "Customize the Dashboard"
description = "Customize the Kubeflow Central Dashboard menu items and integrate third-party apps"
weight = 90
+++

## How to customize the Kubeflow Central Dashboard?

The Kubeflow Central Dashboard provides a way to customize the menu items and integrate third-party apps.

For example, the below image shows the Kubeflow Central Dashboard with a custom **"My App"** menu item:

<img src="/docs/images/dashboard/custom-menu-item.png" 
     alt="Kubeflow Central Dashboard - Customize Menu Items"
     class="mt-3 mb-3 border border-info rounded">
</img>

## Central Dashboard ConfigMap

The Kubeflow Central Dashboard is configured using a Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/).

The `CD_CONFIGMAP_NAME` environment variable on the central-dashboard Deployment specifies the name of the ConfigMap (`centraldashboard-config` by default).

You can find examples of the ConfigMap in the following locations:

- [Default](https://github.com/kubeflow/kubeflow/blob/v1.9.0/components/centraldashboard/manifests/base/configmap.yaml)
- [Default + KServe](https://github.com/kubeflow/kubeflow/blob/v1.9.0/components/centraldashboard/manifests/overlays/kserve/patches/configmap.yaml)

## External Links

The `externalLinks` section of the ConfigMap adds links to the sidebar for external sites (not hosted on the Kubernetes cluster).

Each element of `externalLinks` is a JSON object with the following fields:

- `type`: must be set to `"item"`
- `iframe`: must be set to `false`
- `text`: the text to display for the link
- `url`: the URL to open when the link is clicked
- `icon`: an [iron-icon](https://www.webcomponents.org/element/@polymer/iron-icons/demo/demo/index.html) name to display for the link.
    - Note, you must exclude the `icons:` prefix
    - For example, to use `icons:launch` you would set `"launch"`
    - For example, to use `social:mood` you would set `"social:mood"`

For example, the below ConfigMap adds a link to the Kubeflow website:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: centraldashboard-config
  namespace: kubeflow
data:
  settings: |-
    ...
  links: |-
    {
      "menuLinks": [
        ...
      ],
      "externalLinks": [
        {
          "type": "item",
          "iframe": false,
          "text": "Kubeflow Website",
          "url": "https://www.kubeflow.org/",
          "icon": "launch"
        }
      ],
      "quickLinks": [
        ...
      ],
      "documentationItems": [
        ...
      ]
    }
```

## Documentation Links

The `documentationItems` section of the ConfigMap adds links to the "Documentation" section of the Home page.

Each element of `documentationItems` is a JSON object with the following fields:

- `text`: the text to display for the link
- `desc`: the description to display below the link
- `link`: the URL to open when the link is clicked

For example, the below ConfigMap adds a link to the Kubeflow website documentation:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: centraldashboard-config
  namespace: kubeflow
data:
  settings: |-
    ...
  links: |-
    {
      "menuLinks": [
        ...
      ],
      "externalLinks": [
        ...
      ],
      "quickLinks": [
        ...
      ],
      "documentationItems": [
        {
          "text": "Kubeflow Website",
          "desc": "Kubeflow website documentation",
          "link": "https://www.kubeflow.org/docs/"
        }
      ]
    }
```

## In-Cluster Links

### Create VirtualService

If you have a non-Kubeflow application running on the cluster, you may expose it through the Kubeflow Central Dashboard by creating a [`VirtualService`](https://istio.io/latest/docs/reference/config/networking/virtual-service/) on the Kubeflow Istio Gateway.
To do this, your app must have an injected Istio sidecar and be exposed as a Kubernetes Service.

For example, the below `VirtualService` exposes `Service/my-app` from the `my-namespace` namespace on the Kubeflow Istio Gateway under the path `/my-app/`:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-custom-app
  namespace: <MY_APP_NAMESPACE>
spec:
  gateways:
    ## the istio gateway which is serving kubeflow
    ## TEMPLATE: <KUBEFLOW_GATEWAY_NAMESPACE>/<KUBEFLOW_GATEWAY_NAME>
    - kubeflow/kubeflow-gateway
  hosts:
    - '*'
  http:
    - headers:
        request:
          add:
            x-forwarded-prefix: /my-app
      match:
        - uri:
            prefix: /my-app/
      rewrite:
        uri: /
      route:
        - destination:
            host: <MY_APP_SERVICE_NAME>.<MY_APP_NAMESPACE>.svc.cluster.local
            port:
              number: 80
```

Creating this `VirtualService` should make the application available at the `/_/my-app/` path on the Kubeflow Istio Gateway.

```text
http(s)://<KUBEFLOW_ISTIO_GATEWAY>/_/my-app/
```

{{% alert title="UserID Header Authentication" color="info" %}}
Each request to the application will have a header named `kubeflow-userid` with the user's email address, which may be used for authentication.

To ensure that this header is not spoofed, you should ensure that the application is ONLY accessible from the Kubeflow Istio Gateway.
This could be achieved by:

- creating an ALLOW `AuthorizationPolicy` which requires the `from[].source[].principals[]` to be `cluster.local/ns/<ISTIO_GATEWAY_NAMESPACE>/sa/<ISTIO_GATEWAY_SERVICE_ACCOUNT>`
- ensuring that out-of-mesh traffic is blocked by the sidecar using a `DestinationRule` with `trafficPolicy.tls.mode` set to `ISTIO_MUTUAL` for the `Service` backing the application
{{% /alert %}}

### Add In-Cluster Link

The `menuLinks` section of the ConfigMap adds links to the sidebar for __in-cluster__ applications.

Each element of `menuLinks` is a JSON object with the following fields:

- `type`: must be set to `"item"`
- `link`: the path to open when the link is clicked
- `text`: the text to display for the link
- `icon`: an [iron-icon](https://www.webcomponents.org/element/@polymer/iron-icons/demo/demo/index.html) name to display for the link.
    - Note, you must exclude the `icons:` prefix
    - For example, to use `icons:launch` you would set `"launch"`
    - For example, to use `social:mood` you would set `"social:mood"`

For example, the below ConfigMap adds the ["my-app" application](#create-virtualservice) from above:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: centraldashboard-config
  namespace: kubeflow
data:
  settings: |-
    ...
  links: |-
    {
      "menuLinks": [
        ...
        {
          "type": "item",
          "link": "/my-app/",
          "text": "My App",
          "icon": "social:mood"
        },
        ...
      ],
      "externalLinks": [
        ...
      ],
      "quickLinks": [
        ...
      ],
      "documentationItems": [
        ...
      ]
    }
```

{{% alert title="Namespaced Applications" color="info" %}}
If you have instances of your application in each profile namespace, you can use `{ns}` in the `link` field to dynamically insert the active profile namespace into the link.

For example, if you have an instance of the application in the `profile1` namespace and another instance in the `profile2` namespace.
You may configure your `VirtualService` to expose the application under the path `/my-app/{ns}/`:

```text
http(s)://<KUBEFLOW_ISTIO_GATEWAY>/_/my-app/profile1/
http(s)://<KUBEFLOW_ISTIO_GATEWAY>/_/my-app/profile2/
```

The `menuLinks` element for such and app might look like this:

```json
{
  "type": "item",
  "link": "/my-app/{ns}/",
  "text": "My App",
  "icon": "social:mood"
}
```

Because the application pods are within the profile namespaces, existing Kubeflow AuthorizationPolicies should restrict the application to profile contributors.
For example, if the user is a contributor of the `profile1` namespace (but not `profile2`), they will be able to access `http(s)://<KUBEFLOW_ISTIO_GATEWAY>/_/my-app/profile1/` but not `http(s)://<KUBEFLOW_ISTIO_GATEWAY>/_/my-app/profile2/`.
{{% /alert %}}