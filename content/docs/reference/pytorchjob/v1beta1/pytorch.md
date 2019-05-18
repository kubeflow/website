+++
title = "PyTorchJob"
description = "Reference documentation for PyTorchJob"
weight = 100
+++
<p>Packages:</p>
<ul>
<li>
<a href="#kubeflow.org">kubeflow.org</a>
</li>
</ul>
<h2 id="kubeflow.org">kubeflow.org</h2>
<p>
<p>Package v1beta1 is the v1beta1 version of the API.</p>
</p>
Resource Types:
<ul><li>
<a href="#PyTorchJob">PyTorchJob</a>
</li></ul>
<h3 id="PyTorchJob">PyTorchJob
</h3>
<p>
<p>PyTorchJob represents the configuration of PyTorchJob</p>
</p>
<table>
<thead>
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
kubeflow.org/v1beta1
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
<p>Standard object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code></br>
<em>
<a href="#PyTorchJobSpec">
PyTorchJobSpec
</a>
</em>
</td>
<td>
<p>Specification of the desired behavior of the PyTorchJob.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta1/common/#CleanPodPolicy">
common/v1beta1.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>CleanPodPolicy defines the policy to kill pods after PyTorchJob is
succeeded.
Default to Running.</p>
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
<p>TTLSecondsAfterFinished is the TTL to clean up pytorch-jobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Default to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>pytorchReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta1/common/#ReplicaSpec">
map[github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1beta1.PyTorchReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1beta1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>PyTorchReplicaSpecs is map of PyTorchReplicaType and PyTorchReplicaSpec
specifies the PyTorch replicas to run.
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
<a href="/docs/reference/tfjob/v1beta1/common/#JobStatus">
common/v1beta1.JobStatus
</a>
</em>
</td>
<td>
<p>Most recently observed status of the PyTorchJob.
This data may not be up to date.
Populated by the system.
Read-only.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="PyTorchJobSpec">PyTorchJobSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#PyTorchJob">PyTorchJob</a>)
</p>
<p>
<p>PyTorchJobSpec is a desired state description of the PyTorchJob.</p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta1/common/#CleanPodPolicy">
common/v1beta1.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>CleanPodPolicy defines the policy to kill pods after PyTorchJob is
succeeded.
Default to Running.</p>
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
<p>TTLSecondsAfterFinished is the TTL to clean up pytorch-jobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Default to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>pytorchReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta1/common/#ReplicaSpec">
map[github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1beta1.PyTorchReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1beta1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>PyTorchReplicaSpecs is map of PyTorchReplicaType and PyTorchReplicaSpec
specifies the PyTorch replicas to run.
For example,
{
&ldquo;Master&rdquo;: PyTorchReplicaSpec,
&ldquo;Worker&rdquo;: PyTorchReplicaSpec,
}</p>
</td>
</tr>
</tbody>
</table>
<h3 id="PyTorchReplicaType">PyTorchReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>PyTorchReplicaType is the type for PyTorchReplica.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>e8d4d04</code>.
</em></p>
