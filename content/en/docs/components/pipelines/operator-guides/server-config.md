+++
title = "Server Configuration"
description = "Guidance on managing your Kubeflow Pipelines instances"
weight = 2
+++


By default, you can use Kubeflow Pipelines deployment manifests as provided,
which aim to offer a standard configuration for most use cases. At the meantime,
customizations are available for more advanced usage.

When deploying Kubeflow Pipelines servers, you can pass various environment variables
to customize the behavior of servers.

## Frontend Server

When deploying frontend server called `ml-pipeline-ui`, you can pass various environment
variables to customize the server behavior for your namespace. Some examples are shown
in the [ml-pipeline-ui-deployment.yaml](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/pipeline/ml-pipeline-ui-deployment.yaml#L32-L50).

### Artifact storage endpoint allowlist

You can configure `ALLOWED_ARTIFACT_DOMAIN_REGEX` to allowlist object storage endpoint
that your frontend server will fetch artifacts from. If the domain that frontend server
tries to fetch does not match the regular expression defined in
`ALLOWED_ARTIFACT_DOMAIN_REGEX`, it will return error to users that the requested domain
is not allowed.

#### Standalone Kubeflow Pipelines deployment

By default, the value for `ALLOWED_ARTIFACT_DOMAIN_REGEX` is `"^.*$"`. You can customize
this value for your users, for example: `^.*.yourdomain$` in the
[ml-pipeline-ui-deployment.yaml](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/pipeline/ml-pipeline-ui-deployment.yaml#L32-L50).


#### Full fledged Kubeflow deployment

For full fledged Kubeflow, each namespace corresponds to a project with the same name.
To configure the `ALLOWED_ARTIFACT_DOMAIN_REGEX` value for user namespace, add an entry in `ml-pipeline-ui-artifact`
just like this example in [sync.py](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/installs/multi-user/pipelines-profile-controller/sync.py#L304-L310) for `ALLOWED_ARTIFACT_DOMAIN_REGEX` environment variable,
the entry is identical to the environment variable instruction in Standalone Kubeflow Pipelines
deployment.

## Proxy

Since KFP 2.5, you can set a server-scoped proxy configuration for the backend by setting any of the following environment variables (in uppercase) in the 
API Server deployment. All variables are optional.

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `NO_PROXY`

If `HTTP_PROXY` or `HTTPS_PROXY` is set and `NO_PROXY` is not set, `NO_PROXY` will automatically be set to `localhost,127.0.0.1,.svc.cluster.local,kubernetes.default.svc,metadata-grpc-service,0,1,2,3,4,5,6,7,8,9`.

### Example of an API Server deployment with `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` set

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ml-pipeline
    application-crd-id: kubeflow-pipelines
  name: ml-pipeline
  namespace: kubeflow
spec:
  selector:
    matchLabels:
      app: ml-pipeline
      application-crd-id: kubeflow-pipelines
  template:
    metadata:
      annotations:
        cluster-autoscaler.kubernetes.io/safe-to-evict: "true"
      labels:
        app: ml-pipeline
        application-crd-id: kubeflow-pipelines
    spec:
      containers:
      - env:
        - name: HTTP_PROXY
          value: http://squid.squid.svc.cluster.local:3128
        - name: HTTPS_PROXY
          value: http://squid.squid.svc.cluster.local:3128
        - name: NO_PROXY
          value: localhost,127.0.0.1,.svc.cluster.local,kubernetes.default.svc,metadata-grpc-service,0,1,2,3,4,5,6,7,8,9
        - name: LOG_LEVEL
          value: info
        - name: PIPELINE_LOG_LEVEL
          value: "1"
        - name: AUTO_UPDATE_PIPELINE_DEFAULT_VERSION
          valueFrom:
            configMapKeyRef:
              key: autoUpdatePipelineDefaultVersion
              name: pipeline-install-config
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: OBJECTSTORECONFIG_SECURE
          value: "false"
        - name: OBJECTSTORECONFIG_BUCKETNAME
          valueFrom:
            configMapKeyRef:
              key: bucketName
              name: pipeline-install-config
        - name: DBCONFIG_USER
          valueFrom:
            secretKeyRef:
              key: username
              name: mysql-secret
        - name: DBCONFIG_PASSWORD
          valueFrom:
            secretKeyRef:
              key: password
              name: mysql-secret
        - name: DBCONFIG_DBNAME
          valueFrom:
            configMapKeyRef:
              key: pipelineDb
              name: pipeline-install-config
        - name: DBCONFIG_HOST
          valueFrom:
            configMapKeyRef:
              key: dbHost
              name: pipeline-install-config
        - name: DBCONFIG_PORT
          valueFrom:
            configMapKeyRef:
              key: dbPort
              name: pipeline-install-config
        - name: DBCONFIG_CONMAXLIFETIME
          valueFrom:
            configMapKeyRef:
              key: ConMaxLifeTime
              name: pipeline-install-config
        - name: DB_DRIVER_NAME
          valueFrom:
            configMapKeyRef:
              key: dbType
              name: pipeline-install-config
        - name: DBCONFIG_MYSQLCONFIG_USER
          valueFrom:
            secretKeyRef:
              key: username
              name: mysql-secret
        - name: DBCONFIG_MYSQLCONFIG_PASSWORD
          valueFrom:
            secretKeyRef:
              key: password
              name: mysql-secret
        - name: DBCONFIG_MYSQLCONFIG_DBNAME
          valueFrom:
            configMapKeyRef:
              key: pipelineDb
              name: pipeline-install-config
        - name: DBCONFIG_MYSQLCONFIG_HOST
          valueFrom:
            configMapKeyRef:
              key: mysqlHost
              name: pipeline-install-config
        - name: DBCONFIG_MYSQLCONFIG_PORT
          valueFrom:
            configMapKeyRef:
              key: mysqlPort
              name: pipeline-install-config
        - name: OBJECTSTORECONFIG_ACCESSKEY
          valueFrom:
            secretKeyRef:
              key: accesskey
              name: mlpipeline-minio-artifact
        - name: OBJECTSTORECONFIG_SECRETACCESSKEY
          valueFrom:
            secretKeyRef:
              key: secretkey
              name: mlpipeline-minio-artifact
        image: kind-registry:5000/apiserver:latest
        imagePullPolicy: IfNotPresent
        livenessProbe:
          exec:
            command:
            - wget
            - -q
            - -S
            - -O
            - '-'
            - http://localhost:8888/apis/v1beta1/healthz
          initialDelaySeconds: 3
          periodSeconds: 5
          timeoutSeconds: 2
        name: ml-pipeline-api-server
        ports:
        - containerPort: 8888
          name: http
        - containerPort: 8887
          name: grpc
        readinessProbe:
          exec:
            command:
            - wget
            - -q
            - -S
            - -O
            - '-'
            - http://localhost:8888/apis/v1beta1/healthz
          initialDelaySeconds: 3
          periodSeconds: 5
          timeoutSeconds: 2
        resources:
          requests:
            cpu: 250m
            memory: 500Mi
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          runAsGroup: 0
          runAsNonRoot: true
          runAsUser: 1000
        startupProbe:
          exec:
            command:
            - wget
            - -q
            - -S
            - -O
            - '-'
            - http://localhost:8888/apis/v1beta1/healthz
          failureThreshold: 12
          periodSeconds: 5
          timeoutSeconds: 2
      securityContext:
        seccompProfile:
          type: RuntimeDefault
      serviceAccountName: ml-pipeline
```