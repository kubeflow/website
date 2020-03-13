+++
title = "Multi-user, auth-enabled Kubeflow with kfctl_istio_dex"
description = "Instructions for installing Kubeflow with kfctl_istio_dex.yaml config"
weight = 4
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

This installation of Kubeflow is geared towards existing Kubernetes
clusters and does not depend on any cloud-specific feature.


## Architecture overview

In this reference architecture, we use [Dex](https://github.com/dexidp/dex) and
[Istio](https://istio.io/) for vendor-neutral authentication.

This deployment works well for on-prem installations, where companies/organizations need LDAP/AD integration for multi-user authentication, and they don't want to depend on any cloud-specific feature.

![kfctl_istio_dex_architecture](../../kfctl_istio_dex-architecture.svg)

Read the relevant [article](https://journal.arrikto.com/kubeflow-authentication-with-istio-dex-5eafdfac4782) for more info about this architecture.


## Before you start

The instructions below assume that you have an existing Kubernetes cluster.

Configuring your installation with {{% config-file-istio-dex %}} has a few options you should consider:

* **Disabling istio installation** - If your Kubernetes cluster
  has an existing Istio installation you may choose to not install Istio by removing
  the applications `istio-crds` and `istio-install` in the configuration file
  {{% config-file-istio-dex %}}.

* **Istio configuration for trustworthy JWTs** - This configuration uses Istio version
  1.3.1 with SDS enabled, which requires Kubernetes 1.13 or later.
  Follow [Istio's blog](https://istio.io/blog/2019/trustworthy-jwt-sds/) to add API server configurations to your Kubernetes cluster.
  Ensure that the `TokenRequest` feature flag is set to `true` in the cluster.
  For `kubeadm` created clusters, set the API server flags in the pod manifest at `/etc/kubernetes/manifests/kube-api-server.yaml`.
  For example, the Istio community runs their test-infrastructure with the following API server flags:
  ```
  "service-account-issuer": "kubernetes.default.svc"
  "service-account-signing-key-file": "/etc/kubernetes/pki/sa.key"
  ```
  
* **Default password in static file configuration for Dex** - The configuration file 
  {{% config-file-istio-dex %}} contains a default 
  [staticPasswords](https://github.com/dexidp/dex/blob/0f8c4db9f61476a8f80e60f5950992149a1cc0cb/examples/config-dev.yaml#L91-L95)
  user with email set to `admin@kubeflow.org` and password 
  `12341234`. You should change this configuration or replace it with a 
  [Dex connector](https://github.com/dexidp/dex#connectors).

<a id="prepare-environment"></a>
## Prepare your environment

Follow these steps to download the kfctl binary for the Kubeflow CLI and set
some handy environment variables:

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Create environment variables to make the deployment process easier:

```bash
# Add kfctl to PATH, to make the kfctl binary easier to use.
# Use only alphanumeric characters or - in the directory name.
export PATH=$PATH:"<path-to-kfctl>"

# Set the following kfctl configuration file:
export CONFIG_URI="{{% config-uri-istio-dex %}}"

# Set KF_NAME to the name of your Kubeflow deployment. You also use this
# value as directory name when creating your configuration directory.
# For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
export KF_NAME=<your choice of name for the Kubeflow deployment>

# Set the path to the base directory where you want to store one or more 
# Kubeflow deployments. For example, /opt.
# Then set the Kubeflow application directory for this deployment.
export BASE_DIR=<path to a base directory>
export KF_DIR=${BASE_DIR}/${KF_NAME}
```
Notes:

* **${KF_NAME}** - The name of your Kubeflow deployment.
  If you want a custom deployment name, specify that name here.
  For example,  `my-kubeflow` or `kf-test`.
  The value of KF_NAME must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.
  You also use this value as directory name when creating the directory where 
  your Kubeflow  configurations are stored, that is, the Kubeflow application 
  directory.

* **${KF_DIR}** - The full path to your Kubeflow application directory.

* **${CONFIG_URI}** - The GitHub address of the configuration YAML file that
  you want to use to deploy Kubeflow. The URI used in this guide is
  {{% config-uri-istio-dex %}}.
  When you run `kfctl apply` or `kfctl build` (see the next step), kfctl creates
  a local version of the configuration YAML file which you can further
  customize if necessary.


<a id="set-up-and-deploy"></a>
## Set up and deploy Kubeflow

To set up and deploy Kubeflow using the **default settings**,
run the `kfctl apply` command:

```bash
mkdir -p ${KF_DIR}
cd ${KF_DIR}

# Download the config file and change the default login credentials.
wget -O kfctl_istio_dex.yaml $CONFIG_URI
export CONFIG_FILE=${KF_DIR}/kfctl_istio_dex.yaml

# Credentials for the default user are admin@kubeflow.org:12341234
# To change them, please edit the dex-auth application parameters
# inside the KfDef file.
vim $CONFIG_FILE

kfctl apply -V -f ${CONFIG_FILE}
```

## Alternatively, set up your configuration for later deployment

If you want to customize your configuration before deploying Kubeflow, you can 
set up your configuration files first, then edit the configuration, then
deploy Kubeflow:

1. Run the `kfctl build` command to set up your configuration:

  ```
  mkdir -p ${KF_DIR}
  cd ${KF_DIR}
  kfctl build -V -f ${CONFIG_URI}
  ```

1. Edit the configuration files, as described in the guide to
  [customizing your Kubeflow deployment](/docs/other-guides/kustomize/).

1. Set an environment variable pointing to your local configuration file:

  ```
  export CONFIG_FILE=${KF_DIR}/kfctl_istio_dex.yaml
  ```

1. Run the `kfctl apply` command to deploy Kubeflow:

  ```
  kfctl apply -V -f ${CONFIG_FILE}
  ```

## Accessing Kubeflow

### Log in as a static user

The default way of accessing Kubeflow is via port-forward.
This enables you to get started quickly without imposing any requirements on your environment.

```bash
# Kubeflow will be available at localhost:8080
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

The credentials are the ones you specified in the KfDef file, or the default (`admin@kubeflow.org`:`12341234`).
It is highly recommended to change the default credentials.
To add static users or change the existing one, see [the relevant section](#add-static-users-for-basic-auth).

When you're ready, you can expose your Kubeflow deployment with a LoadBalancer Service or an Ingress.
For more information, see the [expose kubeflow section](#expose-kubeflow).

### Add static users for basic auth

To add users to basic auth, you just have to edit the Dex ConfigMap under the key `staticPasswords`.
```bash
# Download the dex config
kubectl get configmap dex -n auth -o jsonpath='{.data.config\.yaml}' > dex-config.yaml

# Edit the dex config with extra users.
# The password must be hashed with bcrypt with an at least 10 difficulty level.
# You can use an online tool like: https://passwordhashing.com/BCrypt

# After editing the config, update the ConfigMap
kubectl create configmap dex --from-file=config.yaml=dex-config.yaml -n auth --dry-run -oyaml | kubectl apply -f -

# Restart Dex to pick up the changes in the ConfigMap
kubectl rollout restart deployment dex -n auth
```

### Log in with LDAP / Active Directory

As you saw in the overview, we use [Dex](https://github.com/dexidp/dex) for providing user authentication.
Dex supports several authentication methods:

* Static users, as described above
* LDAP / Active Directory
* External Identity Provider (IdP) (for example Google, LinkedIn, GitHub, ...)

This section focuses on setting up Dex to authenticate with an existing LDAP database.

1. ***(Optional)*** If you don't have an LDAP database, you can set one up following these instructions:
    
    1. Deploy a new LDAP Server as a StatefulSet. This also deploys phpLDAPadmin, a GUI for interacting with your LDAP Server.
        
        <details>
        
        <summary>LDAP Server Manifest</summary>
        {{< highlight yaml >}}
        apiVersion: v1
        kind: Service
        metadata:
          labels:
            app: ldap
          name: ldap-service
          namespace: kubeflow
        spec:
          type: ClusterIP
          clusterIP: None
          ports:
            - port: 389
          selector:
            app: ldap
        ---
        
        apiVersion: apps/v1
        kind: StatefulSet
        metadata:
          name: ldap
          namespace: kubeflow
          labels:
            app: ldap
        spec:
          serviceName: ldap-service
          replicas: 1
          selector:
            matchLabels:
              app: ldap
          template:
            metadata:
              labels:
                app: ldap
            spec:
              containers:
                - name: ldap
                  image: osixia/openldap:1.2.4
                  volumeMounts:
                    - name: ldap-data
                      mountPath: /var/lib/ldap
                    - name: ldap-config
                      mountPath: /etc/ldap/slapd.d
                  ports:
                    - containerPort: 389
                      name: openldap
                  env:
                    - name: LDAP_LOG_LEVEL
                      value: "256"
                    - name: LDAP_ORGANISATION
                      value: "Example"
                    - name: LDAP_DOMAIN
                      value: "example.com"
                    - name: LDAP_ADMIN_PASSWORD
                      value: "admin"
                    - name: LDAP_CONFIG_PASSWORD
                      value: "config"
                    - name: LDAP_BACKEND
                      value: "mdb"
                    - name: LDAP_TLS
                      value: "false"
                    - name: LDAP_REPLICATION
                      value: "false"
                    - name: KEEP_EXISTING_CONFIG
                      value: "false"
                    - name: LDAP_REMOVE_CONFIG_AFTER_SETUP
                      value: "true"
              volumes:
                - name: ldap-config
                  emptyDir: {}
          volumeClaimTemplates:
              - metadata:
                  name: ldap-data
                spec:
                  accessModes: [ "ReadWriteOnce" ]
                  resources:
                    requests:
                      storage: 10Gi
        
        ---
        
        apiVersion: v1
        kind: Service
        metadata:
          labels:
            app: phpldapadmin
          name: phpldapadmin-service
          namespace: kubeflow
        spec:
          type: ClusterIP
          ports:
            - port: 80
          selector:
            app: phpldapadmin
        
        ---
        
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: phpldapadmin
          namespace: kubeflow
          labels:
            app: phpldapadmin
        spec:
          replicas: 1
          selector:
            matchLabels:
              app: phpldapadmin
          template:
            metadata:
              labels:
                app: phpldapadmin
            spec:
              containers:
                - name: phpldapadmin
                  image: osixia/phpldapadmin:0.8.0
                  ports:
                    - name: http-server
                      containerPort: 80
                  env:
                    - name: PHPLDAPADMIN_HTTPS
                      value: "false"
                    - name: PHPLDAPADMIN_LDAP_HOSTS
                      value : "#PYTHON2BASH:[{'ldap-service.kubeflow.svc.cluster.local': [{'server': [{'tls': False}]},{'login': [        {'bind_id': 'cn=admin,dc=example,dc=com'}]}]}]"
        {{< /highlight >}}
        
        </details>
        
        
    1. Seed the LDAP database with new entries.
        
        ```bash
        kubectl exec -it -n kubeflow ldap-0 -- bash
        ldapadd -x -D "cn=admin,dc=example,dc=com" -W
        # Enter password "admin".
        # Press Ctrl+D to complete after pasting the snippet below.
        ```
        
        <details>
        
        <summary>LDAP Seed Users and Groups</summary>
        ```ldif
        # If you used the OpenLDAP Server deployment in step 1,
        # then this object already exists.
        # If it doesn't, uncomment this.
        #dn: dc=example,dc=com
        #objectClass: dcObject
        #objectClass: organization
        #o: Example
        #dc: example
        
        dn: ou=People,dc=example,dc=com
        objectClass: organizationalUnit
        ou: People
        
        dn: cn=Nick Kiliadis,ou=People,dc=example,dc=com
        objectClass: person
        objectClass: inetOrgPerson
        givenName: Nick
        sn: Kiliadis
        cn: Nick Kiliadis
        uid: nkili
        mail: nkili@example.com
        userpassword: 12341234
        
        dn: cn=Robin Spanakopita,ou=People,dc=example,dc=com
        objectClass: person
        objectClass: inetOrgPerson
        givenName: Robin
        sn: Spanakopita
        cn: Robin Spanakopita
        uid: rspanakopita
        mail: rspanakopita@example.com
        userpassword: 43214321
        
        # Group definitions.
        
        dn: ou=Groups,dc=example,dc=com
        objectClass: organizationalUnit
        ou: Groups
        
        dn: cn=admins,ou=Groups,dc=example,dc=com
        objectClass: groupOfNames
        cn: admins
        member: cn=Nick Kiliadis,ou=People,dc=example,dc=com
        
        dn: cn=developers,ou=Groups,dc=example,dc=com
        objectClass: groupOfNames
        cn: developers
        member: cn=Nick Kiliadis,ou=People,dc=example,dc=com
        member: cn=Robin Spanakopita,ou=People,dc=example,dc=com
        ```
        
        </details>

1. To use your LDAP/AD server with Dex, you have to edit the Dex config. To edit the ConfigMap containing the Dex config, follow these steps:

    1. Get the current Dex config from the corresponding Config Map.
        
        {{< highlight bash >}}
        kubectl get configmap dex -n auth -o jsonpath='{.data.config\.yaml}' > dex-config.yaml
        {{< /highlight >}}

    1. Add the LDAP-specific options. Here is an example to help you out. It is configured to work with the example LDAP Server you set up previously.
        
        <details>
        
        <summary>Dex LDAP Config Section</summary>
        {{< highlight yaml >}}
        connectors:
        - type: ldap
          # Required field for connector id.
          id: ldap
          # Required field for connector name.
          name: LDAP
          config:
            # Host and optional port of the LDAP server in the form "host:port".
            # If the port is not supplied, it will be guessed based on "insecureNoSSL",
            # and "startTLS" flags. 389 for insecure or StartTLS connections, 636
            # otherwise.
            host: ldap-service.kubeflow.svc.cluster.local:389
          
            # Following field is required if the LDAP host is not using TLS (port 389).
            # Because this option inherently leaks passwords to anyone on the same network
            # as dex, THIS OPTION MAY BE REMOVED WITHOUT WARNING IN A FUTURE RELEASE.
            #
            insecureNoSSL: true
          
            # If a custom certificate isn't provide, this option can be used to turn off
            # TLS certificate checks. As noted, it is insecure and shouldn't be used outside
            # of explorative phases.
            #
            insecureSkipVerify: true
          
            # When connecting to the server, connect using the ldap:// protocol then issue
            # a StartTLS command. If unspecified, connections will use the ldaps:// protocol
            #
            startTLS: false
          
            # Path to a trusted root certificate file. Default: use the host's root CA.
            # rootCA: /etc/dex/ldap.ca
            # clientCert: /etc/dex/ldap.cert
            # clientKey: /etc/dex/ldap.key
          
            # A raw certificate file can also be provided inline.
            # rootCAData: ( base64 encoded PEM file )
          
            # The DN and password for an application service account. The connector uses
            # these credentials to search for users and groups. Not required if the LDAP
            # server provides access for anonymous auth.
            # Please note that if the bind password contains a `$`, it has to be saved in an
            # environment variable which should be given as the value to `bindPW`.
            bindDN: cn=admin,dc=example,dc=com
            bindPW: admin
          
            # The attribute to display in the provided password prompt. If unset, will
            # display "Username"
            usernamePrompt: username
          
            # User search maps a username and password entered by a user to a LDAP entry.
            userSearch:
              # BaseDN to start the search from. It will translate to the query
              # "(&(objectClass=person)(uid=<username>))".
              baseDN: ou=People,dc=example,dc=com
              # Optional filter to apply when searching the directory.
              filter: "(objectClass=inetOrgPerson)"
          
              # username attribute used for comparing user entries. This will be translated
              # and combined with the other filter as "(<attr>=<username>)".
              username: uid
              # The following three fields are direct mappings of attributes on the user entry.
              # String representation of the user.
              idAttr: uid
              # Required. Attribute to map to Email.
              emailAttr: mail
              # Maps to display name of users. No default value.
              nameAttr: givenName
          
            # Group search queries for groups given a user entry.
            groupSearch:
              # BaseDN to start the search from. It will translate to the query
              # "(&(objectClass=group)(member=<user uid>))".
              baseDN: ou=Groups,dc=example,dc=com
              # Optional filter to apply when searching the directory.
              filter: "(objectClass=groupOfNames)"
          
              # Following two fields are used to match a user to a group. It adds an additional
              # requirement to the filter that an attribute in the group must match the user's
              # attribute value.
              userAttr: DN
              groupAttr: member
          
              # Represents group name.
              nameAttr: cn
        {{< /highlight >}}
        
        </details>
        
    1. Append the LDAP config section to the dex config.
        
        {{< highlight bash >}}
        cat dex-config.yaml dex-config-ldap-partial.yaml > dex-config-final.yaml
        {{< /highlight >}}
        
    1. Apply the new config.
        {{< highlight bash >}}
        kubectl create configmap dex --from-file=config.yaml=dex-config-final.yaml -n auth --dry-run -oyaml | kubectl apply -f -
        {{< /highlight >}}
        
    1. Restart the Dex deployment: `kubectl rollout restart deployment dex -n auth`

### Expose Kubeflow

While port-forward is a great way to get started, it is not a long-term, production-ready solution.
In this section, we explore the process of exposing your cluster to the outside world.

NOTE: It is highly recommended to change the default credentials before exposing your Kubeflow cluster.
See [the relevant section](#add-static-users-for-basic-auth) for how to edit Dex static users.

#### Secure with HTTPS

Since we are exposing our cluster to the outside world, it's important to secure it with HTTPS.
Here we will configure automatic self-signed certificates.

Edit the Istio Gateway Object and expose port 443 with HTTPS.
In addition, make port 80 redirect to 443:

{{< highlight bash >}}
kubectl edit -n kubeflow gateways.networking.istio.io kubeflow-gateway
{{< /highlight >}}

The Gateway Spec should look like the following:

{{< highlight yaml >}}
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


#### Expose with a LoadBalancer

If you don't have support for LoadBalancer on your cluster, please follow the instructions below to deploy MetalLB in Layer 2 mode. (You can read more about Layer 2 mode in the [MetalLB docs](https://metallb.universe.tf/configuration/#layer-2-configuration).)

<details>

<summary>MetalLB deployment</summary>

**Deploy MetalLB:**

1. Apply the manifest:
      
    ```
    kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.8.1/manifests/metallb.yaml
    ```
  
1. Allocate a pool of addresses on your local network for MetalLB to use. You
   need at least one address for the Istio Gateway. This example assumes
   addresses `10.0.0.100-10.0.0.110`. *You must modify these addresses based on
   your environment*.

    ```
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: metallb-system
      name: config
    data:
      config: |
        address-pools:
        - name: default
          protocol: layer2
          addresses:
          - 10.0.0.100-10.0.0.110
    EOF
    ```


**Ensure that MetalLB works as expected (optional):**

1. Create a dummy service:

    ```
    kubectl create service loadbalancer nginx --tcp=80:80
    service/nginx created
    ```

1. Ensure that MetalLB has allocated an IP address for the service:

    ```
    kubectl describe service nginx
    ...
    Events:
      Type    Reason       Age   From                Message
      ----    ------       ----  ----                -------
      Normal  IPAllocated  69s   metallb-controller  Assigned IP "10.0.0.101"
    ```

1. Check the corresponding MetalLB logs:

    ```
    kubectl logs -n metallb-system -l component=controller
    ...
    {"caller":"service.go:98","event":"ipAllocated","ip":"10.0.0.101","msg":"IP address assigned by controller","service":"default/nginx","ts":"2019-08-09T15:12:09.376779263Z"}
    ```
    
1. Create a pod that will be exposed with the service:

    ```
    kubectl run nginx --image nginx --restart=Never -l app=nginx
    pod/nginx created
    ```
    
1. Ensure that MetalLB has assigned a node to announce the allocated IP address:

    ```
    kubectl describe service nginx
    ...
    Events:
      Type    Reason       Age   From                Message
      ----    ------       ----  ----                -------
       Normal  nodeAssigned  4s    metallb-speaker     announcing from node "node-2"
    ```
    
1. Check the corresponding MetalLB logs:

    ```
    kubectl logs -n metallb-system -l component=speaker
    ...
    {"caller":"main.go:246","event":"serviceAnnounced","ip":"10.0.0.101","msg":"service has IP, announcing","pool":"default","protocol":"layer2","service":"default/nginx","ts":"2019-08-09T15:14:02.433876894Z"}
    ```
    
1. Check that MetalLB responds to ARP requests for the allocated IP address:

    ```
    arping -I eth0 10.0.0.101
    ...
    ARPING 10.0.0.101 from 10.0.0.204 eth0
    Unicast reply from 10.0.0.101 [6A:13:5A:D2:65:CB]  2.619ms
    ```
    
1. Check the corresponding MetalLB logs:

    ```
    kubectl logs -n metallb-system -l component=speaker
    ...
    {"caller":"arp.go:102","interface":"eth0,"ip":"10.0.0.101","msg":"got ARP request for service IP, sending response","responseMAC":"6a:13:5a:d2:65:cb","senderIP":"10.0.0.204","senderMAC":"9a:1f:7c:95:ca:dc","ts":"2019-08-09T15:14:52.912056021Z"}
    ```
    
1. Verify that everything works as expected:

    ```
    curl http://10.0.0.101
    ...
    <p><em>Thank you for using nginx.</em></p>
    ...
    ```
    
1. Clean up:

    ```
    kubectl delete service nginx
    kubectl delete pod nginx
    ```
    
</details>


To expose Kubeflow with a LoadBalancer Service, just change the type of the `istio-ingressgateway` Service to `LoadBalancer`.

{{< highlight bash >}}
kubectl patch service -n istio-system istio-ingressgateway -p '{"spec": {"type": "LoadBalancer"}}'
{{< /highlight >}}

After that, get the LoadBalancer's IP or Hostname from its status and create the necessary certificate.

{{< highlight bash >}}
kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0]}'
{{< /highlight >}}

Create the Certificate with cert-manager:
{{< highlight yaml >}}
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: istio-ingressgateway-certs
  namespace: istio-system
spec:
  commonName: istio-ingressgateway.istio-system.svc
  # Use ipAddresses if your LoadBalancer issues an IP
  ipAddresses:
  - <LoadBalancer IP>
  # Use dnsNames if your LoadBalancer issues a hostname (eg on AWS)
  dnsNames:
  - <LoadBalancer HostName>
  isCA: true
  issuerRef:
    kind: ClusterIssuer
    name: kubeflow-self-signing-issuer
  secretName: istio-ingressgateway-certs
{{< /highlight >}}

After applying the above Certificate, cert-manager will generate the TLS certificate inside the istio-ingressgateway-certs secrets.
The istio-ingressgateway-certs secret is mounted on the istio-ingressgateway deployment and used to serve HTTPS.

Navigate to `https://<LoadBalancer Address>/` and start using Kubeflow.

### Troubleshooting

If the Kubeflow dashboard is not available at `https://<kubeflow address>` ensure that:

1. the virtual services have been created:

    ```
    kubectl get virtualservices -n kubeflow
    kubectl get virtualservices -n kubeflow centraldashboard -o yaml
    ```
    
    If not, then kfctl has aborted for some reason, and not completed successfully.

1. OIDC auth service redirects you to Dex:

    ```
    curl -k https://<kubeflow address>/ -v
    ...
    < HTTP/2 302
    < content-type: text/html; charset=utf-8
    < location:
    /dex/auth?client_id=kubeflow-authservice-oidc&redirect_uri=%2Flogin%2Foidc&response_type=code&scope=openid+profile+email+groups&state=vSCMnJ2D
    < date: Fri, 09 Aug 2019 14:33:21 GMT
    < content-length: 181
    < x-envoy-upstream-service-time: 0
    < server: istio-envoy
    ```
    
Please join the [Kubeflow Slack](https://kubeflow.slack.com/join/shared_invite/zt-cpr020z4-PfcAue_2nw67~iIDy7maAQ) to report any issues, request help, and give us feedback on this config.

Some additional debugging information:

OIDC AuthService logs:
```bash
kubectl logs -n istio-system -l app=authservice
```
Dex logs:
```bash
kubectl logs -n auth -l app=dex
```
Istio ingress-gateway logs:
```bash
kubectl logs -n istio-system -l istio=ingressgateway
```

Istio ingressgateway service:
```bash
kubectl get service -n istio-system istio-ingressgateway -o yaml
```

MetalLB logs:
```bash
kubectl logs -n metallb-system -l component=speaker
...
{"caller":"arp.go:102","interface":"br100","ip":"10.0.0.100","msg":"got ARP request for service IP, sending response","responseMAC":"62:41:bd:5f:cc:0d","senderIP":"10.0.0.204","senderMAC":"9a:1f:7c:95:ca:dc","ts":"2019-07-31T13:19:19.7082836Z"}
```
```bash
kubectl logs -n metallb-system  -l component=controller
...
{"caller":"service.go:98","event":"ipAllocated","ip":"10.0.0.100","msg":"IP address assigned by controller","service":"istio-system/istio-ingressgateway","ts":"2019-07-31T12:17:46.234638607Z"}
```

## Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KF_DIR}
# If you want to delete all the resources, run:
kfctl delete -f ${CONFIG_FILE}
```

## Understanding the deployment process

The kfctl deployment process includes the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources.
* `kfctl delete` - Deletes the resources.

## Application layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and 
directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your 
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow: {{% config-uri-istio-dex %}}
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE}`,
    which you can further customize if necessary.

* **kustomize** is a directory that contains the kustomize packages for Kubeflow
  applications. See 
  [how Kubeflow uses kustomize](/docs/other-guides/kustomize/).

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * You can customize the Kubernetes resources by modifying the manifests and
    running `kfctl apply` again.

We recommend that you check in the contents of your `${KF_DIR}` directory
into source control.

## Next steps

* Run a [sample machine learning workflow](/docs/examples/kubeflow-samples/).
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/).
