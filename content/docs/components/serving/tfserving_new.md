+++
title = "TensorFlow Serving"
description = "Serving TensorFlow models"
weight = 51
+++

## Serving a model

To deploy a model we create following resources as illustrated below

- A deployment to deploy the model using TFServing
- A K8s service to create an endpoint a service
- An Istio virtual service to route traffic to the model and expose it through the Istio gateway
- An Istio DestinationRule is for doing traffic splitting.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: mnist
  name: mnist-service
  namespace: kubeflow
spec:
  ports:
  - name: grpc-tf-serving
    port: 9000
    targetPort: 9000
  - name: http-tf-serving
    port: 8500
    targetPort: 8500
  selector:
    app: mnist
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: mnist
  name: mnist-v1
  namespace: kubeflow
spec:
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: mnist
        version: v1
    spec:
      containers:
      - args:
        - --port=9000
        - --rest_api_port=8500
        - --model_name=mnist
        - --model_base_path=YOUR_MODEL
        command:
        - /usr/bin/tensorflow_model_server
        image: tensorflow/serving:1.11.1
        imagePullPolicy: IfNotPresent
        livenessProbe:
          initialDelaySeconds: 30
          periodSeconds: 30
          tcpSocket:
            port: 9000
        name: mnist
        ports:
        - containerPort: 9000
        - containerPort: 8500
        resources:
          limits:
            cpu: "4"
            memory: 4Gi
          requests:
            cpu: "1"
            memory: 1Gi
        volumeMounts:
        - mountPath: /var/config/
          name: config-volume
      volumes:
      - configMap:
          name: mnist-v1-config
        name: config-volume
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  labels:
  name: mnist-service
  namespace: kubeflow
spec:
  host: mnist-service
  subsets:
  - labels:
      version: v1
    name: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  labels:
  name: mnist-service
  namespace: kubeflow
spec:
  gateways:
  - kubeflow-gateway
  hosts:
  - '*'
  http:
  - match:
    - method:
        exact: POST
      uri:
        prefix: /tfserving/models/mnist
    rewrite:
      uri: /v1/models/mnist:predict
    route:
    - destination:
        host: mnist-service
        port:
          number: 8500
        subset: v1
      weight: 100
```

Referring to the above example, you can customize your deployment by changing the following configurations in the YAML file:

- In the deployment resource, the `model_base_path` argument points to the model.
  Change the value to your own model. 

- The example contains three configurations for Google Cloud Storage (GCS) access:
  volumes (secret `user-gcp-sa`), volumeMounts, and
  env (GOOGLE_APPLICATION_CREDENTIALS).
  If your model is not at GCS (e.g. using S3 from AWS), See the section below on 
  how to setup access.

- GPU. If you want to use GPU, add `nvidia.com/gpu: 1`
  in container resources, and use a GPU image, for example:
  `tensorflow/serving:1.11.1-gpu`.
  ```yaml
  resources:
    limits:
      cpu: "4"
      memory: 4Gi
      nvidia.com/gpu: 1
  ```

- The resource `VirtualService` and `DestinationRule` are for routing.
  With the example above, the model is accessible at `HOSTNAME/tfserving/models/mnist` 
  (HOSTNAME is your Kubeflow deployment hostname). To change the path, edit the
  `http.match.uri` of VirtualService.

### Pointing to the model
Depending where model file is located, set correct parameters

*Google cloud*

Change the deployment spec as follows:

```yaml
spec:
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
      labels:
        app: mnist
        version: v1
    spec:
      containers:
      - args:
        - --port=9000
        - --rest_api_port=8500
        - --model_name=mnist
        - --model_base_path=gs://kubeflow-examples-data/mnist
        command:
        - /usr/bin/tensorflow_model_server
        env:
        - name: GOOGLE_APPLICATION_CREDENTIALS
          value: /secret/gcp-credentials/user-gcp-sa.json
        image: tensorflow/serving:1.11.1-gpu
        imagePullPolicy: IfNotPresent
        livenessProbe:
          initialDelaySeconds: 30
          periodSeconds: 30
          tcpSocket:
            port: 9000
        name: mnist
        ports:
        - containerPort: 9000
        - containerPort: 8500
        resources:
          limits:
            cpu: "4"
            memory: 4Gi
            nvidia.com/gpu: 1
          requests:
            cpu: "1"
            memory: 1Gi
        volumeMounts:
        - mountPath: /var/config/
          name: config-volume
        - mountPath: /secret/gcp-credentials
          name: gcp-credentials
      volumes:
      - configMap:
          name: mnist-v1-config
        name: config-volume
      - name: gcp-credentials
        secret:
          secretName: user-gcp-sa
```

The changes are:

- environment variable  `GOOGLE_APPLICATION_CREDENTIALS`
- volume `gcp-credentials`
- volumeMount `gcp-credentials`

We need a service account that can access the model.
If you are using Kubeflow's click-to-deploy app, there should be already a secret, `user-gcp-sa`, in the cluster.

The model at gs://kubeflow-examples-data/mnist is publicly accessible. However, if your environment doesn't
have google cloud credential setup, TF serving will not be able to read the model.
See this [issue](https://github.com/kubeflow/kubeflow/issues/621) for example.
To setup the google cloud credential, you should either have the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` pointing to the credential file, or run `gcloud auth login`.
See [doc](https://cloud.google.com/docs/authentication/) for more detail.

*S3*

To use S3, first you need to create secret that will contain access credentials. Use base64 to encode your credentials and check details in the Kubernetes guide to [creating a secret manually](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret-manually)
```
apiVersion: v1
metadata:
  name: secretname
data:
  AWS_ACCESS_KEY_ID: bmljZSB0cnk6KQ==
  AWS_SECRET_ACCESS_KEY: YnV0IHlvdSBkaWRuJ3QgZ2V0IG15IHNlY3JldCE=
kind: Secret
```

Then use the following manifest as an example:

```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: s3
  name: s3
  namespace: kubeflow
spec:
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: null
      labels:
        app: s3
        version: v1
    spec:
      containers:
      - args:
        - --port=9000
        - --rest_api_port=8500
        - --model_name=s3
        - --model_base_path=s3://abc
        - --monitoring_config_file=/var/config/monitoring_config.txt
        command:
        - /usr/bin/tensorflow_model_server
        env:
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              key: AWS_ACCESS_KEY_ID
              name: secretname
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              key: AWS_SECRET_ACCESS_KEY
              name: secretname
        - name: AWS_REGION
          value: us-west-1
        - name: S3_USE_HTTPS
          value: "true"
        - name: S3_VERIFY_SSL
          value: "true"
        - name: S3_ENDPOINT
          value: s3.us-west-1.amazonaws.com
        image: tensorflow/serving:1.11.1
        imagePullPolicy: IfNotPresent
        livenessProbe:
          initialDelaySeconds: 30
          periodSeconds: 30
          tcpSocket:
            port: 9000
        name: s3
        ports:
        - containerPort: 9000
        - containerPort: 8500
        resources:
          limits:
            cpu: "4"
            memory: 4Gi
          requests:
            cpu: "1"
            memory: 1Gi
        volumeMounts:
        - mountPath: /var/config/
          name: config-volume
      volumes:
      - configMap:
          name: s3-config
        name: config-volume

```

### Sending prediction request directly
If the service type is LoadBalancer, it will have its own accessible external ip.
Get the external ip by:

```
kubectl get svc mnist-service
```

And then send the request

```
curl -X POST -d @input.json http://EXTERNAL_IP:8500/v1/models/mnist:predict
```

### Sending prediction request through ingress and IAP
If the service type is ClusterIP, you can access through ingress.
It's protected and only one with right credentials can access the endpoint.
Below shows how to programmatically authenticate a service account to access IAP.

1. Save the client ID that you used to 
  [deploy Kubeflow](/docs/gke/deploy/) as `IAP_CLIENT_ID`.
2. Create a service account
   ```
   gcloud iam service-accounts create --project=$PROJECT $SERVICE_ACCOUNT
   ```
3. Grant the service account access to IAP enabled resources:
   ```
   gcloud projects add-iam-policy-binding $PROJECT \
    --role roles/iap.httpsResourceAccessor \
    --member serviceAccount:$SERVICE_ACCOUNT
   ```
4. Download the service account key:
   ```
   gcloud iam service-accounts keys create ${KEY_FILE} \
      --iam-account ${SERVICE_ACCOUNT}@${PROJECT}.iam.gserviceaccount.com
   ```
5. Export the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to point to the key file of the service account.

Finally, you can send the request with this python
[script](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/iap_request.py)

```
python iap_request.py https://YOUR_HOST/tfserving/models/mnist IAP_CLIENT_ID --input=YOUR_INPUT_FILE
```

## Telemetry and Rolling out model using Istio

Please look at the [Istio guide](/docs/components/istio/).

## Logs and metrics with Stackdriver
See the guide to [logging and monitoring](/docs/gke/monitoring/) 
for instructions on getting logs and metrics using Stackdriver.
