+++
title = "TFJob TensorFlow"
description = "Reference documentation for TFJob"
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
<p>Package v1beta2 is the v1beta2 version of the API.</p>
</p>
Resource Types:
<ul><li>
<a href="#TFJob">TFJob</a>
</li></ul>
<h3 id="TFJob">TFJob
</h3>
<p>
<p>TFJob represents the configuration of signal TFJob</p>
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
kubeflow.org/v1beta2
</code>
</td>
</tr>
<tr>
<td>
<code>kind</code></br>
string
</td>
<td><code>TFJob</code></td>
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
<a href="#TFJobSpec">
TFJobSpec
</a>
</em>
</td>
<td>
<p>Specification of the desired behavior of the TFJob.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>activeDeadlineSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the duration in seconds relative to the startTime that the job may be active
before the system tries to terminate it; value must be positive integer.
This method applies only to pods with restartPolicy == OnFailure or Always.</p>
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
<p>Optional number of retries before marking this job failed.</p>
</td>
</tr>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta2/common/#CleanPodPolicy">
common/v1beta2.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>CleanPodPolicy defines the policy to kill pods after TFJob is
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
<p>TTLSecondsAfterFinished is the TTL to clean up tf-jobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Default to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>tfReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta2/common/#ReplicaSpec">
map[github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1beta2.TFReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1beta2.ReplicaSpec
</a>
</em>
</td>
<td>
<p>TFReplicaSpecs is map of TFReplicaType and ReplicaSpec
specifies the TF replicas to run.
For example,
{
&ldquo;PS&rdquo;: ReplicaSpec,
&ldquo;Worker&rdquo;: ReplicaSpec,
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
<a href="/docs/reference/tfjob/v1beta2/common/#JobStatus">
common/v1beta2.JobStatus
</a>
</em>
</td>
<td>
<p>Most recently observed status of the TFJob.
This data may not be up to date.
Populated by the system.
Read-only.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="TFJobSpec">TFJobSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#TFJob">TFJob</a>)
</p>
<p>
<p>TFJobSpec is a desired state description of the TFJob.</p>
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
<code>activeDeadlineSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the duration in seconds relative to the startTime that the job may be active
before the system tries to terminate it; value must be positive integer.
This method applies only to pods with restartPolicy == OnFailure or Always.</p>
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
<p>Optional number of retries before marking this job failed.</p>
</td>
</tr>
<tr>
<td>
<code>cleanPodPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta2/common/#CleanPodPolicy">
common/v1beta2.CleanPodPolicy
</a>
</em>
</td>
<td>
<p>CleanPodPolicy defines the policy to kill pods after TFJob is
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
<p>TTLSecondsAfterFinished is the TTL to clean up tf-jobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Default to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>tfReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1beta2/common/#ReplicaSpec">
map[github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1beta2.TFReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1beta2.ReplicaSpec
</a>
</em>
</td>
<td>
<p>TFReplicaSpecs is map of TFReplicaType and ReplicaSpec
specifies the TF replicas to run.
For example,
{
&ldquo;PS&rdquo;: ReplicaSpec,
&ldquo;Worker&rdquo;: ReplicaSpec,
}</p>
</td>
</tr>
</tbody>
</table>
<h3 id="TFReplicaType">TFReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>TFReplicaType is the type for TFReplica.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>7e5ece8d</code>.
</em></p>
