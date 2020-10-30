+++
title = "Authentication using OIDC in Azure"
description = "Authentication and authorization support through OIDC for Kubeflow in Azure"
weight = 6
+++

This section shows the how to set up Kubeflow with authentication and authorization support through OIDC in Azure using [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/).

## Prerequisites

- Install the [prerequisites for Kubeflow in Azure](/docs/azure/deploy/install-kubeflow)
- [Register an application with the Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
- [Add a client secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)

  **Note:**  Save your client ID, client secret, and tenant ID in a secure place to be used in the next steps to configure OIDC Auth Service.

## Kubeflow configuration

1. Download the latest kfctl {{% kf-latest-version %}} release from the [Kubeflow releases page](<https://github.com/kubeflow/kfctl/releases/tag/>{{% kf-latest-version %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
    ```

1. Run the below commands to build configuration files before deploying Kubeflow. The code below includes an optional command to add the binary kfctl to your path - if you don’t add it, you must use the full path to the kfctl binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to where kfctl was unpacked>

    # Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
    # name of the directory containing your configuration.
    # For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more
    # Kubeflow deployments. For example, '/opt/'.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}

    # Set the configuration file to use, such as the file specified below:
    export CONFIG_URI="{{% config-uri-azure-oidc %}}"

    # Generate and deploy Kubeflow:
    mkdir -p ${KF_DIR}
    cd ${KF_DIR}
    kfctl build -V -f ${CONFIG_URI}
    ```

    * **${KF_NAME}** - The name of your Kubeflow deployment.
      If you want a custom deployment name, specify that name here.
      For example,  `my-kubeflow` or `kf-test`.
      The value of `KF_NAME` must consist of lower case alphanumeric characters or
      '-', and must start and end with an alphanumeric character.
      The value of this variable cannot be greater than 25 characters. It must
      contain just a name, not a directory path.
      This value also becomes the name of the directory where your Kubeflow
      configurations are stored, that is, the Kubeflow application directory.

    * **${KF_DIR}** - The full path to your Kubeflow application directory.

1. Configure OIDC Auth service settings:

   In `/manifests/stacks/azure/application/oidc-authservice/kustomization.yaml` update the settings with values corresponding your app registration as follows:

    ```
    - client_id=<client_id>
    - oidc_provider=https://login.microsoftonline.com/<tenant_id>/v2.0
    - oidc_redirect_uri=https://<load_balancer_ip> or dns_name>/login/oidc
    - oidc_auth_url=https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/authorize
    - application_secret=<client_secret>
    - skip_auth_uri=
    - namespace=istio-system
    - userid-header=kubeflow-userid
    - userid-prefix=
    ```

1. Configure OIDC scopes:

    In `/manifests/istio/oidc-authservice/base/statefulset.yaml` update [OIDC scopes](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes) to remove groups and keep profile and email.

    ```
    - name: OIDC_SCOPES
     value: "profile email"
    ```

3. Deploy Kubeflow:

    ```shell
    kfctl apply -V -f ${CONFIG_URI}
    ```

4. Check that the resources were deployed correctly in namespace `kubeflow`:

    ```shell
    kubectl get all -n kubeflow
    ```

## Expose Kubeflow securely over HTTPS

1. Update Istio Gateway to expose port 443 with HTTPS and make port 80 redirect to 443:

    ```shell
    kubectl edit -n kubeflow gateways.networking.istio.io kubeflow-gateway
    ```

    The Gateway spec should look like the following:

    {{< highlight yaml >}}
    apiVersion: networking.istio.io/v1alpha3
    kind: Gateway
    metadata:
    name: kubeflow-gateway
    namespace: kubeflow
    spec:
    selector:
        istio: ingressgateway
    servers:
    - hosts:
        - '*'
        port:
            name: http
            number: 80
            protocol: HTTP
        # Upgrade HTTP to HTTPS
        tls:
            httpsRedirect: true
    - hosts:
        - '*'
        port:
            name: https
            number: 443
            protocol: HTTPS
        tls:
            mode: SIMPLE
            privateKey: /etc/istio/ingressgateway-certs/tls.key
            serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
    {{< /highlight >}}

1. Expose Kubeflow with a load balancer service:

    To expose Kubeflow with a load balancer service, change the type of the `istio-ingressgateway` service to `LoadBalancer`.

    ```shell
    kubectl patch service -n istio-system istio-ingressgateway -p '{"spec": {"type": "LoadBalancer"}}'
    ```

    After that, obtain the `LoadBalancer` IP address or Hostname from its status and create the necessary certificate.

    ```shell
    kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0]}'
    ```

    {{% alert title="Warning" color="warning" %}}
    If you are exposing [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) gateway through public IP, make sure it matches the IP address of OIDC `REDIRECT_URL`, by running:
    
    ```shell
    kubectl get statefulset authservice -n istio-system -o yaml
    ```

    If it doesn't match, update `REDIRECT_URL` in the StatefulSet to be the public IP address from the last step, by running:
    
    ```shell
    kubectl edit statefulset authservice -n istio-system
    ```

    {{% /alert %}}


1. Create a self-signed Certificate with cert-manager:

   Create a new file `certficate.yaml` with the YAML below to create a self-signed Certificate with cert-manager. For production environments, you should use appropriate trusted CA Certificate.

    {{< highlight yaml >}}
    apiVersion: cert-manager.io/v1alpha2
    kind: Certificate
    metadata:
    name: istio-ingressgateway-certs
    namespace: istio-system
    spec:
    commonName: istio-ingressgateway.istio-system.svc
    # Use ipAddresses if your LoadBalancer issues an IP address
    ipAddresses:
    - <LoadBalancer IP>
    # Use dnsNames if your LoadBalancer issues a hostname
    dnsNames:
    - <LoadBalancer HostName>
    isCA: true
    issuerRef:
        kind: ClusterIssuer
        name: kubeflow-self-signing-issuer
    secretName: istio-ingressgateway-certs
    {{< /highlight >}}

    Apply `certificate.yaml` in `istio-system` namespace

    ```shell
    kubectl apply -f certificate.yaml -n istio-system
    ```

    After applying the above Certificate, cert-manager will generate the TLS certificate inside the istio-ingressgateway-certs secrets. The istio-ingressgateway-certs secret is mounted on the istio-ingressgateway deployment and used to serve HTTPS.

1. [Configure Redirect URI for your registered App](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-redirect-uri)

   Add the redirect URI below to the app registered with Microsoft Identity:
  
   `https://<YOUR_LOADBALANCER_IP_ADDRESS_OR_DNS_NAME>/login/oidc`

   **Note:** Make sure the app's redirect URI matches the `oidc_redirect_uri` value in OIDC auth service settings.

   Navigate to `https://<YOUR_LOADBALANCER_IP_ADDRESS_OR_DNS_NAME>/` and start using Kubeflow.

## Authenticate Kubeflow pipelines using [Kubeflow Pipelines SDK](https://www.kubeflow.org/docs/pipelines/sdk/sdk-overview/)

Perform interactive login from browser by visitng `https://<YOUR_LOADBALANCER_IP_ADDRESS_OR_DNS_NAME>/` and copy the value of cookie `authservice_session` to authenticate using SDK with below code:

```bash
import kfp
authservice_session_cookie='authservice_session=<cookie>'
client = kfp.Client(host='https://<YOUR_LOADBALANCER_IP_ADDRESS_OR_DNS_NAME>/pipeline',
                    cookies=authservice_session_cookie)
client.list_experiments(namespace='<your_namespace>')
```

   **Limitation:** The current OIDC auth service in Kubeflow system supports only [Authorization Code Flow](https://openid.net/specs/openid-connect-basic-1_0.html#CodeFlow).
