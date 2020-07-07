+++
title = "TFJob TensorFlow"
description = "Reference documentation for TFJob"
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
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2ftensorflow%2fv1.TFJob">TFJob</a>
</li></ul>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFJob">TFJob
</h3>
<p>
<p>Represents a TFJob resource.</p>
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
<p>Standard Kubernetes object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code></br>
<em>
<a href="#github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFJobSpec">
TFJobSpec
</a>
</em>
</td>
<td>
<p>Specification of the desired state of the TFJob.</p>
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
<p>Defines the policy for cleaning up pods after the TFJob completes.
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
<p>Defines the TTL for cleaning up finished TFJobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Defaults to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>tfReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of TFReplicaType (type) to ReplicaSpec (value). Specifies the TF cluster configuration.
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
<a href="/docs/reference/tfjob/v1/common/#JobStatus">
common/v1.JobStatus
</a>
</em>
</td>
<td>
<p>Most recently observed status of the TFJob.
Read-only (modified by the system).</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFJobSpec">TFJobSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2ftensorflow%2fv1.TFJob">TFJob</a>)
</p>
<p>
<p>TFJobSpec is a desired state description of the TFJob.</p>
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
<p>Defines the policy for cleaning up pods after the TFJob completes.
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
<p>Defines the TTL for cleaning up finished TFJobs (temporary
before kubernetes adds the cleanup controller).
It may take extra ReconcilePeriod seconds for the cleanup, since
reconcile gets called periodically.
Defaults to infinite.</p>
</td>
</tr>
<tr>
<td>
<code>tfReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of TFReplicaType (type) to ReplicaSpec (value). Specifies the TF cluster configuration.
For example,
{
&ldquo;PS&rdquo;: ReplicaSpec,
&ldquo;Worker&rdquo;: ReplicaSpec,
}</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1.TFReplicaType">TFReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>TFReplicaType is the type for TFReplica. Can be one of: &ldquo;Chief&rdquo;/&ldquo;Master&rdquo; (semantically equivalent),
&ldquo;Worker&rdquo;, &ldquo;PS&rdquo;, or &ldquo;Evaluator&rdquo;.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>fd76deec</code>.
</em></p>
