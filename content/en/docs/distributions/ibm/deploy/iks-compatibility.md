+++
title = "IBM Cloud Kubernetes and Kubeflow Compatibility"
description = "Compatibility matrix for Kubeflow on IBM Cloud by Kubernetes version"
weight = 6
+++

## Compatibility

The following table relates compatibility between Kubernetes versions 1.22+ of IBM Cloud Kubernetes service and Kubeflow version 1.6.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>IBM Cloud Kubernetes Versions</th>
        <th>Kubeflow 1.6.0</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1.22</td>
        <td><b>Compatible</b></td>
      </tr>
      <tr>
        <td>1.23</td>
        <td><b>Compatible</b></td>
      </tr>
      <tr>
        <td>1.24</td>
        <td><b>Compatible</b></td>
      </tr>
    </tbody>
  </table>
</div>

- **Incompatible**: the combination is not known to work together
- **Compatible**: all Kubeflow features have been tested and verified for the IKS Kubernetes version
- **No known issues**: the combination has not been fully tested but there are no reported issues


## Next Steps

1. 2. Go here for installing [Kubeflow on IKS](/docs/distributions/ibm/deploy/install-kubeflow-on-iks)