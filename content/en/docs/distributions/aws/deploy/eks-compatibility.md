+++
title = "Amazon EKS and Kubeflow Compatibility"
description = "Check compatibility between Amazon EKS and Kubeflow versions"
weight = 25
+++

## Compatibility

Starting with Kubeflow version 1.2, Amazon EKS maintains end-to-end testing between EKS Kubernetes versions and Kubeflow versions. The following table relates compatibility between Kubernetes versions on Amazon EKS and Kubeflow v1.3.1.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>EKS Versions</th>
        <th>Kubeflow v1.3.1</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1.21</td>
        <td><b>Compatible</b></td>
      </tr>
      <tr>
        <td>1.20</td>
        <td><b>Compatible</b></td>
      </tr>
      <tr>
        <td>1.19</td>
        <td><b>Compatible</b></td>
      </tr>
    </tbody>
  </table>
</div>

- **Incompatible**: the combination is not known to work together
- **Compatible**: all Kubeflow features have been tested and verified for the EKS Kubernetes version

### Kubeflow v1.4 and v1.5 Support

Support for Kubeflow-v1.4 and Kubeflow-v1.5 are in active development. You can track the following issues to stay up-to-date on progress:
  - [v1.4 tracking issue](https://github.com/awslabs/kubeflow-manifests/issues/27)
  - [v1.5 tracking issue](https://github.com/awslabs/kubeflow-manifests/issues/91)

