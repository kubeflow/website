+++
title = "MPIJob"
description = "Reference documentation for MPIJob"
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
<p>Package v1alpha2 is the v1alpha2 version of the API.</p>
</p>
Resource Types:
<ul><li>
<a href="#github.com%2fkubeflow%2fmpi-operator%2fpkg%2fapis%2fkubeflow%2fv1alpha2.MPIJob">MPIJob</a>
</li></ul>
<h3 id="github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIJob">MPIJob
</h3>
<p>
<p>Represents a MPIJob resource.</p>
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
kubeflow.org/v1alpha2
</code>
</td>
</tr>
<tr>
<td>
<code>kind</code></br>
string
</td>
<td><code>MPIJob</code></td>
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
<a href="#github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIJobSpec">
MPIJobSpec
</a>
</em>
</td>
<td>
<p>Specification of the desired state of the MPIJob.</p>
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
<p>Defines the policy for cleaning up pods after the MPIJob completes.
Defaults to None.</p>
</td>
</tr>
<tr>
<td>
<code>slotsPerWorker</code></br>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the number of slots per worker used in hostfile.
Defaults to 1.</p>
</td>
</tr>
<tr>
<td>
<code>mainContainer</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies name of the main container which executes the MPI code.</p>
</td>
</tr>
<tr>
<td>
<code>runPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#RunPolicy">
common/v1.RunPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Encapsulates various runtime policies of the distributed training job, for example how to clean up resources and how long the job can stay active.</p>
</td>
</tr>
<tr>
<td>
<code>mpiReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of MPIReplicaType (type) to ReplicaSpec (value). Specifies the MPI cluster configuration.
For example,
{
&ldquo;Launcher&rdquo;: MPIReplicaSpec,
&ldquo;Worker&rdquo;: MPIReplicaSpec,
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
<p>Most recently observed status of the MPIJob.
Read-only (modified by the system).</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIJobSpec">MPIJobSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIJob">MPIJob</a>)
</p>
<p>
<p>MPIJobSpec is a desired state description of the MPIJob.</p>
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
<p>Defines the policy for cleaning up pods after the MPIJob completes.
Defaults to None.</p>
</td>
</tr>
<tr>
<td>
<code>slotsPerWorker</code></br>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the number of slots per worker used in hostfile.
Defaults to 1.</p>
</td>
</tr>
<tr>
<td>
<code>mainContainer</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies name of the main container which executes the MPI code.</p>
</td>
</tr>
<tr>
<td>
<code>runPolicy</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#RunPolicy">
common/v1.RunPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Encapsulates various runtime policies of the distributed training job, for example how to clean up resources and how long the job can stay active.</p>
</td>
</tr>
<tr>
<td>
<code>mpiReplicaSpecs</code></br>
<em>
<a href="/docs/reference/tfjob/v1/common/#ReplicaSpec">
map[github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIReplicaType]*github.com/kubeflow/tf-operator/pkg/apis/common/v1.ReplicaSpec
</a>
</em>
</td>
<td>
<p>A map of MPIReplicaType (type) to ReplicaSpec (value). Specifies the MPI cluster configuration.
For example,
{
&ldquo;Launcher&rdquo;: MPIReplicaSpec,
&ldquo;Worker&rdquo;: MPIReplicaSpec,
}</p>
</td>
</tr>
</tbody>
</table>
<h3 id="github.com/kubeflow/mpi-operator/pkg/apis/kubeflow/v1alpha2.MPIReplicaType">MPIReplicaType
(<code>string</code> alias)</p></h3>
<p>
<p>MPIReplicaType is the type for MPIReplica. Can be one of &ldquo;Launcher&rdquo; or &ldquo;Worker&rdquo;.</p>
</p>
<hr/>
