+++
title = "TFJob Common"
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
<ul></ul>
<h3 id="CleanPodPolicy">CleanPodPolicy
(<code>string</code> alias)</p></h3>
<p>
<p>CleanPodPolicy describes how to deal with pods when the job is finished.</p>
</p>
<h3 id="JobCondition">JobCondition
</h3>
<p>
(<em>Appears on:</em>
<a href="#JobStatus">JobStatus</a>)
</p>
<p>
<p>JobCondition describes the state of the job at a certain point.</p>
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
<code>type</code></br>
<em>
<a href="#JobConditionType">
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
<p>Status of the condition, one of True, False, Unknown.</p>
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
<p>A human readable message indicating details about the transition.</p>
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
<h3 id="JobConditionType">JobConditionType
(<code>string</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#JobCondition">JobCondition</a>)
</p>
<p>
<p>JobConditionType defines all kinds of types of JobStatus.</p>
</p>
<h3 id="JobStatus">JobStatus
</h3>
<p>
<p>JobStatus represents the current observed state of the training Job.</p>
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
<code>conditions</code></br>
<em>
<a href="#JobCondition">
[]JobCondition
</a>
</em>
</td>
<td>
<p>Conditions is an array of current observed job conditions.</p>
</td>
</tr>
<tr>
<td>
<code>replicaStatuses</code></br>
<em>
<a href="#ReplicaStatus">
map[github.com/kubeflow/tf-operator/pkg/apis/common/v1beta2.ReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1beta2.ReplicaStatus
</a>
</em>
</td>
<td>
<p>ReplicaStatuses is map of ReplicaType and ReplicaStatus,
specifies the status of each replica.</p>
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
<p>Represents time when the job was acknowledged by the job controller.
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
<p>Represents time when the job was completed. It is not guaranteed to
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
<p>Represents last time when the job was reconciled. It is not guaranteed to
be set in happens-before order across separate operations.
It is represented in RFC3339 form and is in UTC.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="ReplicaSpec">ReplicaSpec
</h3>
<p>
<p>ReplicaSpec is a description of the replica</p>
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
<code>replicas</code></br>
<em>
int32
</em>
</td>
<td>
<p>Replicas is the desired number of replicas of the given template.
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
<p>Template is the object that describes the pod that
will be created for this replica. RestartPolicy in PodTemplateSpec
will be overide by RestartPolicy in ReplicaSpec</p>
</td>
</tr>
<tr>
<td>
<code>restartPolicy</code></br>
<em>
<a href="#RestartPolicy">
RestartPolicy
</a>
</em>
</td>
<td>
<p>Restart policy for all replicas within the job.
One of Always, OnFailure, Never and ExitCode.
Default to Never.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="ReplicaStatus">ReplicaStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#JobStatus">JobStatus</a>)
</p>
<p>
<p>ReplicaStatus represents the current observed state of the replica.</p>
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
<h3 id="ReplicaType">ReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>ReplicaType represents the type of the replica. Each operator needs to define its
own set of ReplicaTypes.</p>
</p>
<h3 id="RestartPolicy">RestartPolicy
(<code>string</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#ReplicaSpec">ReplicaSpec</a>)
</p>
<p>
<p>RestartPolicy describes how the replicas should be restarted.
Only one of the following restart policies may be specified.
If none of the following policies is specified, the default one
is RestartPolicyAlways.</p>
</p>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>7cbb6a81</code>.
</em></p>
