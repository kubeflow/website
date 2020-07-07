+++
title = "PyTorchJob"
description = "Reference documentation for PyTorchJob"
weight = 100
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

<p>Packages:</p>
<ul>
<li>
<a href="#kubeflow.org">kubeflow.org</a>
</li>
</ul>
<h2 id="kubeflow.org">kubeflow.org</h2>
<p>
<p>Package v1 is the v1 version of the API.</p>
</p>
Resource Types:
<ul><li>
<a href="#github.com%2fkubeflow%2fpytorch-operator%2fpkg%2fapis%2fpytorch%2fv1.PyTorchJob">PyTorchJob</a>
</li></ul>
<h3 id="github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchJob">PyTorchJob
</h3>
<p>
<p>Represents a PyTorchJob resource.</p>
</p>
<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>apiVersion</code></br>
string</td>
<td>
<code>
kubeflow.org/v1
</code>
</td>
</tr>
<tr>
<td>
<code>kind</code></br>
string
</td>
<td><code>PyTorchJob</code></td>
</tr>
<tr>
<td>
<code>metadata</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<p>Standard Kubernetes object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code></br>
<em>
<a href="#github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchJobSpec">
PyTorchJobSpec
</a>
</em>
</td>
<td>
<p>Specification of the desired state of the PyTorchJob.</p>
<br/>
<br/>
<div class="table-responsive"><table class="table table-bordered">
<tr>
<td>
<code>activeDeadlineSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the duration (in seconds) since startTime during which the job can remain active
before it is terminated. Must be a positive integer.
This setting applies only to pods where restartPolicy is OnFailure or Always.</p>
</td>
</tr>
<tr>
<td>
<code>backoffLimit</code></br>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Number of retries before marking this job as failed.</p>
</td>
</tr>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#CleanPodPolicy">
common/v1.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>Defines the policy for cleaning up pods after the PyTorchJob completes.
Defaults to Running.</p>
</td>
</tr>
<tr>
<td>
<code>ttlSecondsAfterFinished</code></br>
<em>
int32
</em>
</td>
<td>
<p>Defines the TTL for cleaning up finished PyTorchJobs (temporary
before Kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Defaults to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>pytorchReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of PyTorchReplicaType (type) to ReplicaSpec (value). Specifies the PyTorch cluster configuration.
For example,
{
&ldquo;Master&rdquo;: PyTorchReplicaSpec,
&ldquo;Worker&rdquo;: PyTorchReplicaSpec,
}</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#JobStatus">
common/v1.JobStatus
</a>
</em>
</td>
<td>
<p>Most recently observed status of the PyTorchJob.
Read-only (modified by the system).</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchJobSpec">PyTorchJobSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2fpytorch-operator%2fpkg%2fapis%2fpytorch%2fv1.PyTorchJob">PyTorchJob</a>)
</p>
<p>
<p>PyTorchJobSpec is a desired state description of the PyTorchJob.</p>
</p>
<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>activeDeadlineSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the duration (in seconds) since startTime during which the job can remain active
before it is terminated. Must be a positive integer.
This setting applies only to pods where restartPolicy is OnFailure or Always.</p>
</td>
</tr>
<tr>
<td>
<code>backoffLimit</code></br>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Number of retries before marking this job as failed.</p>
</td>
</tr>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#CleanPodPolicy">
common/v1.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>Defines the policy for cleaning up pods after the PyTorchJob completes.
Defaults to Running.</p>
</td>
</tr>
<tr>
<td>
<code>ttlSecondsAfterFinished</code></br>
<em>
int32
</em>
</td>
<td>
<p>Defines the TTL for cleaning up finished PyTorchJobs (temporary
before Kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Defaults to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>pytorchReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of PyTorchReplicaType (type) to ReplicaSpec (value). Specifies the PyTorch cluster configuration.
For example,
{
&ldquo;Master&rdquo;: PyTorchReplicaSpec,
&ldquo;Worker&rdquo;: PyTorchReplicaSpec,
}</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1.PyTorchReplicaType">PyTorchReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>PyTorchReplicaType is the type for PyTorchReplica. Can be one of &ldquo;Master&rdquo; or &ldquo;Worker&rdquo;.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>e775742</code>.
</em></p>
