+++
title = "Operator Network Security"
description = "how to configure security of the Dataplane of Trainer Operator for Zero-Trust policy"
weight = 25
+++

This guide describes you how to configure your networking/security configuration for a Zero-Trust Network policy, which emphasizes 
- Restriction of Pods Commnication(Blocking ingress)
- Ecnrypting/Securing Communication(mTLS)

## Restriction of Pods Communication
This emphasizes restricting pod-to-pod communications and blocking unauthorized ingress traffic to enhance isolation in multi-tenant environments. Coverage includes policy YAML examples, label selectors for Trainer Custom Resources (e.g., PyTorchJob or XGBoostJob), egress allowances for framework-specific inter-node sync (e.g., NCCL), ingress denial for external threats, and integration best practices with JobSet controller for resilient, secure training runtimes.

```YAML
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tfjob-internal-allow
  namespace: default
spec:
  podSelector:
    matchLabels:
      job-name: tf-dist-job  # Label added by Kubeflow Training Operator
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              job-name: tf-dist-job
  egress:
    - to:
        - podSelector:
            matchLabels:
              job-name: tf-dist-job
```

## Encrypting Communication

The Kubeflow Trainer Operator doesn't directly implement or configure a mTLS,
but if your cluster has isto, kuma, or Linkerd, 
it can inject sidecar proxies that handle mTLS.

- Enable Sidecar
```bash
kubectl label namespace default istio-injection=enabled
```

- Create Peer Auth policy

```YAML
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-strict
  namespace: default
spec:
  mtls:
    mode: STRICT
```

## Troubleshooting