+++
title = "Multi-user, auth-enabled Kubeflow with kfctl_existing_arrikto"
description = "Instructions for installing Kubeflow with kfctl_existing_arrikto.yaml config"
weight = 4
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

This installation of Kubeflow is maintained by
[Arrikto](https://www.arrikto.com/), it is geared towards existing Kubernetes
clusters and does not depend on any cloud-specific feature.

In this reference architecture, we use [Dex](https://github.com/dexidp/dex) and
[Istio](https://istio.io/) for vendor-neutral authentication.

This deployment works well for on-prem installations, where companies/organizations need LDAP/AD integration for multi-user authentication, and they don't want to depend on any cloud-specific feature.

![kfctl_existing_arrikto_architecture](../../kfctl_existing_arrikto-architecture.svg)

Read the relevant [article](https://journal.arrikto.com/kubeflow-authentication-with-istio-dex-5eafdfac4782) for more info about this architecture.


### Prerequisites

You need a Kubernetes Cluster with LoadBalancer support.

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


### Deploy Kubeflow

Follow these steps to deploy Kubeflow:

1. Download a `kfctl` release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/) and unpack it:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```
 

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary `kfctl` to your path. If you don't add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

```bash
# Add kfctl to PATH, to make the kfctl binary easier to use.
export PATH=$PATH:"<path to kfctl>"
export KFAPP="<your choice of application directory name>"
export CONFIG="{{% config-uri-existing-arrikto %}}"

# Specify credentials for the default user.
export KUBEFLOW_USER_EMAIL="admin@kubeflow.org"
export KUBEFLOW_PASSWORD="12341234"

kfctl init ${KFAPP} --config=${CONFIG} -V
cd ${KFAPP}
kfctl generate all -V
kfctl apply all -V
```

 * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
  configurations to be stored. This directory is created when you run
  `kfctl init`. If you want a custom deployment name, specify that name here.
  The value of this variable becomes the name of your deployment.
  The value of this variable cannot be greater than 25 characters. It must
  contain just the directory name, not the full path to the directory.
  The content of this directory is described in the next section.


### Accessing Kubeflow

#### Log in as a static user

After deploying Kubeflow, the Kubeflow dashboard is available at the Istio Gateway IP.
To get the Istio Gateway IP, run:

```bash
kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Get the IP and open it in a browser: `https://<LoadBalancerIP address>/`.

Enter the credentials you specified in `KUBEFLOW_USER_EMAIL`, `KUBEFLOW_PASSWORD` and access the Kubeflow dashboard!

#### Add static users for basic auth

To add users to basic auth, you just have to edit the Dex ConfigMap under the key `staticPasswords`.
```bash
# Download the dex config
kubectl get configmap dex -n kubeflow -o jsonpath='{.data.config\.yaml}' > dex-config.yaml

# Edit the dex config with extra users.
# The password must be hashed with bcrypt with an at least 10 difficulty level.
# You can use an online tool like: https://passwordhashing.com/BCrypt

# After editing the config, update the ConfigMap
kubectl create configmap dex --from-file=config.yaml=dex-config.yaml -n kubeflow --dry-run -oyaml | kubectl apply -f -
```

#### Log in with LDAP / Active Directory

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
        kubectl get configmap dex -n kubeflow -o jsonpath='{.data.config\.yaml}' > dex-config.yaml
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
        kubectl create configmap dex --from-file=config.yaml=dex-config-final.yaml -n kubeflow --dry-run -oyaml | kubectl apply -f -
        {{< /highlight >}}
        
    1. Restart the Dex deployment, by doing one of the following:
        * Force recreation, by deleting the Dex deployment's Pod(s).
          * `kubectl delete pods -n kubeflow -l app=dex`
        * Trigger a rolling update, by adding/updating a label on the PodTemplate of the Dex deployment.
          * `kubectl edit deployment dex -n kubeflow` will open the Dex deployment in a text editor.
          * Add or update a label on the PodTemplate.
          * Save the deployment to trigger a rolling update.

### Troubleshooting

If the Kubeflow dashboard is not available at `https://<LoadBalancerIP address>` ensure that:

1. the LoadBalancer service for Istio has obtained an external IP, for example:

    ```
    kubectl get services -n istio-system istio-ingressgateway -o yaml
    ...
    status:
      loadBalancer:
        ingress:
        - ip: 10.0.0.100
    ```
    
    If not, then probably there is a misconfiguration of MetalLB.

1. the virtual services have been created:

    ```
    kubectl get virtualservices -n kubeflow
    kubectl get virtualservices -n kubeflow centraldashboard -o yaml
    ```
    
    If not, then kfctl has aborted for some reason, and not completed successfully.

1. OIDC auth service redirects you to Dex:

    ```
    curl -k https://<LoadBalancerIP address>/ -v
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
    
Please join the [Kubeflow Slack](https://kubeflow.slack.com/join/shared_invite/enQtNDg5MTM4NTQyNjczLWUyZGI1ZmExZWExYWY4YzlkOWI4NjljNjJhZjhjMjEwNGFjNmVkNjg2NTg4M2I0ZTM5NDExZWI5YTIyMzVmNzM) to report any issues, request help, and give us feedback on this config.

Some additional debugging information:

OIDC Service logs:
```bash
kubectl logs -n istio-system -l app=authservice
```
Dex logs:
```bash
kubectl logs -n kubeflow -l app=dex
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

### Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KFAPP}
# If you want to delete all the resources, run:
kfctl delete all
```

### Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **k8s** - all resources that run on Kubernetes.
* **all** - platform and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **${KFAPP}/app.yaml** defines configurations related to your Kubeflow deployment.
* **${KFAPP}/kustomize**: contains the YAML manifests that will be deployed.

### Next steps

* Follow the instructions to [connect to the Kubeflow web 
  UIs](/docs/other-guides/accessing-uis/), where you can manage various 
  aspects of your Kubeflow deployment.
* Run a [sample machine learning workflow](/docs/examples/kubeflow-samples/).
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/).
