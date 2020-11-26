+++
title = "TFJob Common"
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
<ul></ul>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.CleanPodPolicy">CleanPodPolicy
(<code>string</code> alias)</p></h3>
<p>
<p>CleanPodPolicy describes how to deal with pods when the job is finished. Can be one
of: All, Running, or None.</p>
</p>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobCondition">JobCondition
</h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2fcommon%2fv1.JobStatus">JobStatus</a>)
</p>
<p>
<p>JobCondition describes the state of the job at a certain point.</p>
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
<code>type</code></br>
<em>
<a href="#github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobConditionType">
JobConditionType
</a>
</em>
</td>
<td>
<p>Type of job condition.</p>
</td>
</tr>
<tr>
<td>
<code>status</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#conditionstatus-v1-core">
Kubernetes core/v1.ConditionStatus
</a>
</em>
</td>
<td>
<p>Status of the condition, one of True, False, or Unknown.</p>
</td>
</tr>
<tr>
<td>
<code>reason</code></br>
<em>
string
</em>
</td>
<td>
<p>The reason for the condition&rsquo;s last transition.</p>
</td>
</tr>
<tr>
<td>
<code>message</code></br>
<em>
string
</em>
</td>
<td>
<p>A readable message indicating details about the transition.</p>
</td>
</tr>
<tr>
<td>
<code>lastUpdateTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<p>The last time this condition was updated.</p>
</td>
</tr>
<tr>
<td>
<code>lastTransitionTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<p>Last time the condition transitioned from one status to another.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobConditionType">JobConditionType
(<code>string</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2fcommon%2fv1.JobCondition">JobCondition</a>)
</p>
<p>
<p>JobConditionType defines all possible types of JobStatus. Can be one of:
Created, Running, Restarting, Succeeded, or Failed.</p>
</p>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobStatus">JobStatus
</h3>
<p>
<p>JobStatus represents the current observed state of the training job.</p>
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
<code>conditions</code></br>
<em>
<a href="#github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobCondition">
[][]github.com/kubeflow/tf-operator/pkg/apis/common/v1.JobCondition
</a>
</em>
</td>
<td>
<p>An array of current observed job conditions.</p>
</td>
</tr>
<tr>
<td>
<code>replicaStatuses</code></br>
<em>
<a href="#github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaStatus">
map[github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaStatus
</a>
</em>
</td>
<td>
<p>A map from ReplicaType (key) to ReplicaStatus (value), specifying the status of each replica.</p>
</td>
</tr>
<tr>
<td>
<code>startTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<p>Represents the time when the job was acknowledged by the job controller.
It is not guaranteed to be set in happens-before order across separate operations.
It is represented in RFC3339 form and is in UTC.</p>
</td>
</tr>
<tr>
<td>
<code>completionTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<p>Represents the time when the job was completed. It is not guaranteed to
be set in happens-before order across separate operations.
It is represented in RFC3339 form and is in UTC.</p>
</td>
</tr>
<tr>
<td>
<code>lastReconcileTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<p>Represents the last time when the job was reconciled. It is not guaranteed to
be set in happens-before order across separate operations.
It is represented in RFC3339 form and is in UTC.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec">ReplicaSpec
</h3>
<p>
<p>ReplicaSpec is a description of the job replica.</p>
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
<code>replicas</code></br>
<em>
int32
</em>
</td>
<td>
<p>The desired number of replicas of the given template.
If unspecified, defaults to 1.</p>
</td>
</tr>
<tr>
<td>
<code>template</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#podtemplatespec-v1-core">
Kubernetes core/v1.PodTemplateSpec
</a>
</em>
</td>
<td>
<p>Describes the pod that will be created for this replica. Note that
RestartPolicy in PodTemplateSpec will be overidden by RestartPolicy in ReplicaSpec.</p>
</td>
</tr>
<tr>
<td>
<code>restartPolicy</code></br>
<em>
<a href="#github.com/kubeflow/tf-operator/pkg/apis/common/v1.RestartPolicy">
RestartPolicy
</a>
</em>
</td>
<td>
<p>Restart policy for all replicas within the job.
One of Always, OnFailure, Never, or ExitCode.
Defaults to Never.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaStatus">ReplicaStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2fcommon%2fv1.JobStatus">JobStatus</a>)
</p>
<p>
<p>ReplicaStatus represents the current observed state of the replica.</p>
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
<code>active</code></br>
<em>
int32
</em>
</td>
<td>
<p>The number of actively running pods.</p>
</td>
</tr>
<tr>
<td>
<code>succeeded</code></br>
<em>
int32
</em>
</td>
<td>
<p>The number of pods which reached phase Succeeded.</p>
</td>
</tr>
<tr>
<td>
<code>failed</code></br>
<em>
int32
</em>
</td>
<td>
<p>The number of pods which reached phase Failed.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaType">ReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>ReplicaType represents the type of the job replica. Each operator (e.g. TensorFlow, PyTorch)
needs to define its own set of ReplicaTypes.</p>
</p>
<h3 id="github.com/kubeflow/tf-operator/pkg/apis/common/v1.RestartPolicy">RestartPolicy
(<code>string</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#github.com%2fkubeflow%2ftf-operator%2fpkg%2fapis%2fcommon%2fv1.ReplicaSpec">ReplicaSpec</a>)
</p>
<p>
<p>RestartPolicy describes how the replicas should be restarted.
Can be one of: Always, OnFailure, Never, or ExitCode.
If none of the following policies is specified, the default one
is RestartPolicyAlways.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>fd76deec</code>.
</em></p>
