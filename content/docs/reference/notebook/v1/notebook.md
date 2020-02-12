<p>Packages:</p>
<ul>
<li>
<a href="#kubeflow.org%2fv1">kubeflow.org/v1</a>
</li>
</ul>
<h2 id="kubeflow.org/v1">kubeflow.org/v1</h2>
<p>
<p>Package v1 contains API Schema definitions for the kubeflow.org v1 API group</p>
</p>
Resource Types:
<ul></ul>
<h3 id="kubeflow.org/v1.Notebook">Notebook
</h3>
<p>
<p>Notebook is the Schema for the notebooks API</p>
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
<code>metadata</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code></br>
<em>
<a href="#kubeflow.org/v1.NotebookSpec">
NotebookSpec
</a>
</em>
</td>
<td>
<br/>
<br/>
<table>
<tr>
<td>
<code>template</code></br>
<em>
<a href="#kubeflow.org/v1.NotebookTemplateSpec">
NotebookTemplateSpec
</a>
</em>
</td>
<td>
<p>INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
Important: Run &ldquo;make&rdquo; to regenerate code after modifying this file</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code></br>
<em>
<a href="#kubeflow.org/v1.NotebookStatus">
NotebookStatus
</a>
</em>
</td>
<td>
</td>
</tr>
</tbody>
</table>
<h3 id="kubeflow.org/v1.NotebookCondition">NotebookCondition
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubeflow.org/v1.NotebookStatus">NotebookStatus</a>)
</p>
<p>
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
string
</em>
</td>
<td>
<p>Type is the type of the condition. Possible values are Running|Waiting|Terminated</p>
</td>
</tr>
<tr>
<td>
<code>lastProbeTime</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#time-v1-meta">
Kubernetes meta/v1.Time
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Last time we probed the condition.</p>
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
<em>(Optional)</em>
<p>(brief) reason the container is in the current state</p>
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
<em>(Optional)</em>
<p>Message regarding why the container is in the current state.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubeflow.org/v1.NotebookSpec">NotebookSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubeflow.org/v1.Notebook">Notebook</a>)
</p>
<p>
<p>NotebookSpec defines the desired state of Notebook</p>
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
<code>template</code></br>
<em>
<a href="#kubeflow.org/v1.NotebookTemplateSpec">
NotebookTemplateSpec
</a>
</em>
</td>
<td>
<p>INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
Important: Run &ldquo;make&rdquo; to regenerate code after modifying this file</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubeflow.org/v1.NotebookStatus">NotebookStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubeflow.org/v1.Notebook">Notebook</a>)
</p>
<p>
<p>NotebookStatus defines the observed state of Notebook</p>
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
<a href="#kubeflow.org/v1.NotebookCondition">
[]NotebookCondition
</a>
</em>
</td>
<td>
<p>Conditions is an array of current conditions</p>
</td>
</tr>
<tr>
<td>
<code>readyReplicas</code></br>
<em>
int32
</em>
</td>
<td>
<p>ReadyReplicas is the number of Pods created by the StatefulSet controller that have a Ready Condition.</p>
</td>
</tr>
<tr>
<td>
<code>containerState</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#containerstate-v1-core">
Kubernetes core/v1.ContainerState
</a>
</em>
</td>
<td>
<p>ContainerState is the state of underlying container.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="kubeflow.org/v1.NotebookTemplateSpec">NotebookTemplateSpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#kubeflow.org/v1.NotebookSpec">NotebookSpec</a>)
</p>
<p>
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
<code>spec</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#podspec-v1-core">
Kubernetes core/v1.PodSpec
</a>
</em>
</td>
<td>
<br/>
<br/>
<table>
<tr>
<td>
<code>volumes</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#volume-v1-core">
[]Kubernetes core/v1.Volume
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>List of volumes that can be mounted by containers belonging to the pod.
More info: <a href="https://kubernetes.io/docs/concepts/storage/volumes">https://kubernetes.io/docs/concepts/storage/volumes</a></p>
</td>
</tr>
<tr>
<td>
<code>initContainers</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#container-v1-core">
[]Kubernetes core/v1.Container
</a>
</em>
</td>
<td>
<p>List of initialization containers belonging to the pod.
Init containers are executed in order prior to containers being started. If any
init container fails, the pod is considered to have failed and is handled according
to its restartPolicy. The name for an init container or normal container must be
unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling
by finding the highest request/limit for each resource type, and then using the max of
of that value or the sum of the normal containers. Limits are applied to init containers
in a similar fashion.
Init containers cannot currently be added or removed.
Cannot be updated.
More info: <a href="https://kubernetes.io/docs/concepts/workloads/pods/init-containers/">https://kubernetes.io/docs/concepts/workloads/pods/init-containers/</a></p>
</td>
</tr>
<tr>
<td>
<code>containers</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#container-v1-core">
[]Kubernetes core/v1.Container
</a>
</em>
</td>
<td>
<p>List of containers belonging to the pod.
Containers cannot currently be added or removed.
There must be at least one container in a Pod.
Cannot be updated.</p>
</td>
</tr>
<tr>
<td>
<code>ephemeralContainers</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#ephemeralcontainer-v1-core">
[]Kubernetes core/v1.EphemeralContainer
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing
pod to perform user-initiated actions such as debugging. This list cannot be specified when
creating a pod, and it cannot be modified by updating the pod spec. In order to add an
ephemeral container to an existing pod, use the pod&rsquo;s ephemeralcontainers subresource.
This field is alpha-level and is only honored by servers that enable the EphemeralContainers feature.</p>
</td>
</tr>
<tr>
<td>
<code>restartPolicy</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#restartpolicy-v1-core">
Kubernetes core/v1.RestartPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Restart policy for all containers within the pod.
One of Always, OnFailure, Never.
Default to Always.
More info: <a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy</a></p>
</td>
</tr>
<tr>
<td>
<code>terminationGracePeriodSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request.
Value must be non-negative integer. The value zero indicates delete immediately.
If this value is nil, the default grace period will be used instead.
The grace period is the duration in seconds after the processes running in the pod are sent
a termination signal and the time when the processes are forcibly halted with a kill signal.
Set this value longer than the expected cleanup time for your process.
Defaults to 30 seconds.</p>
</td>
</tr>
<tr>
<td>
<code>activeDeadlineSeconds</code></br>
<em>
int64
</em>
</td>
<td>
<em>(Optional)</em>
<p>Optional duration in seconds the pod may be active on the node relative to
StartTime before the system will actively try to mark it failed and kill associated containers.
Value must be a positive integer.</p>
</td>
</tr>
<tr>
<td>
<code>dnsPolicy</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#dnspolicy-v1-core">
Kubernetes core/v1.DNSPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set DNS policy for the pod.
Defaults to &ldquo;ClusterFirst&rdquo;.
Valid values are &lsquo;ClusterFirstWithHostNet&rsquo;, &lsquo;ClusterFirst&rsquo;, &lsquo;Default&rsquo; or &lsquo;None&rsquo;.
DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy.
To have DNS options set along with hostNetwork, you have to specify DNS policy
explicitly to &lsquo;ClusterFirstWithHostNet&rsquo;.</p>
</td>
</tr>
<tr>
<td>
<code>nodeSelector</code></br>
<em>
map[string]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>NodeSelector is a selector which must be true for the pod to fit on a node.
Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node.
More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a></p>
</td>
</tr>
<tr>
<td>
<code>serviceAccountName</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>ServiceAccountName is the name of the ServiceAccount to use to run this pod.
More info: <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/">https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/</a></p>
</td>
</tr>
<tr>
<td>
<code>serviceAccount</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>DeprecatedServiceAccount is a depreciated alias for ServiceAccountName.
Deprecated: Use serviceAccountName instead.</p>
</td>
</tr>
<tr>
<td>
<code>automountServiceAccountToken</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.</p>
</td>
</tr>
<tr>
<td>
<code>nodeName</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>NodeName is a request to schedule this pod onto a specific node. If it is non-empty,
the scheduler simply schedules this pod onto that node, assuming that it fits resource
requirements.</p>
</td>
</tr>
<tr>
<td>
<code>hostNetwork</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Host networking requested for this pod. Use the host&rsquo;s network namespace.
If this option is set, the ports that will be used must be specified.
Default to false.</p>
</td>
</tr>
<tr>
<td>
<code>hostPID</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Use the host&rsquo;s pid namespace.
Optional: Default to false.</p>
</td>
</tr>
<tr>
<td>
<code>hostIPC</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Use the host&rsquo;s ipc namespace.
Optional: Default to false.</p>
</td>
</tr>
<tr>
<td>
<code>shareProcessNamespace</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Share a single process namespace between all of the containers in a pod.
When this is set containers will be able to view and signal processes from other containers
in the same pod, and the first process in each container will not be assigned PID 1.
HostPID and ShareProcessNamespace cannot both be set.
Optional: Default to false.</p>
</td>
</tr>
<tr>
<td>
<code>securityContext</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#podsecuritycontext-v1-core">
Kubernetes core/v1.PodSecurityContext
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>SecurityContext holds pod-level security attributes and common container settings.
Optional: Defaults to empty.  See type description for default values of each field.</p>
</td>
</tr>
<tr>
<td>
<code>imagePullSecrets</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#localobjectreference-v1-core">
[]Kubernetes core/v1.LocalObjectReference
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec.
If specified, these secrets will be passed to individual puller implementations for them to use. For example,
in the case of docker, only DockerConfig type secrets are honored.
More info: <a href="https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod">https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod</a></p>
</td>
</tr>
<tr>
<td>
<code>hostname</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the hostname of the Pod
If not specified, the pod&rsquo;s hostname will be set to a system-defined value.</p>
</td>
</tr>
<tr>
<td>
<code>subdomain</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, the fully qualified Pod hostname will be &ldquo;<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>&rdquo;.
If not specified, the pod will not have a domainname at all.</p>
</td>
</tr>
<tr>
<td>
<code>affinity</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#affinity-v1-core">
Kubernetes core/v1.Affinity
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, the pod&rsquo;s scheduling constraints</p>
</td>
</tr>
<tr>
<td>
<code>schedulerName</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, the pod will be dispatched by specified scheduler.
If not specified, the pod will be dispatched by default scheduler.</p>
</td>
</tr>
<tr>
<td>
<code>tolerations</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#toleration-v1-core">
[]Kubernetes core/v1.Toleration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, the pod&rsquo;s tolerations.</p>
</td>
</tr>
<tr>
<td>
<code>hostAliases</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#hostalias-v1-core">
[]Kubernetes core/v1.HostAlias
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>HostAliases is an optional list of hosts and IPs that will be injected into the pod&rsquo;s hosts
file if specified. This is only valid for non-hostNetwork pods.</p>
</td>
</tr>
<tr>
<td>
<code>priorityClassName</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, indicates the pod&rsquo;s priority. &ldquo;system-node-critical&rdquo; and
&ldquo;system-cluster-critical&rdquo; are two special keywords which indicate the
highest priorities with the former being the highest priority. Any other
name must be defined by creating a PriorityClass object with that name.
If not specified, the pod priority will be default or zero if there is no
default.</p>
</td>
</tr>
<tr>
<td>
<code>priority</code></br>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>The priority value. Various system components use this field to find the
priority of the pod. When Priority Admission Controller is enabled, it
prevents users from setting this field. The admission controller populates
this field from PriorityClassName.
The higher the value, the higher the priority.</p>
</td>
</tr>
<tr>
<td>
<code>dnsConfig</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#poddnsconfig-v1-core">
Kubernetes core/v1.PodDNSConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Specifies the DNS parameters of a pod.
Parameters specified here will be merged to the generated DNS
configuration based on DNSPolicy.</p>
</td>
</tr>
<tr>
<td>
<code>readinessGates</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#podreadinessgate-v1-core">
[]Kubernetes core/v1.PodReadinessGate
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>If specified, all readiness gates will be evaluated for pod readiness.
A pod is ready when all its containers are ready AND
all conditions specified in the readiness gates have status equal to &ldquo;True&rdquo;
More info: <a href="https://git.k8s.io/enhancements/keps/sig-network/0007-pod-ready%2B%2B.md">https://git.k8s.io/enhancements/keps/sig-network/0007-pod-ready%2B%2B.md</a></p>
</td>
</tr>
<tr>
<td>
<code>runtimeClassName</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used
to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run.
If unset or empty, the &ldquo;legacy&rdquo; RuntimeClass will be used, which is an implicit class with an
empty definition that uses the default runtime handler.
More info: <a href="https://git.k8s.io/enhancements/keps/sig-node/runtime-class.md">https://git.k8s.io/enhancements/keps/sig-node/runtime-class.md</a>
This is a beta feature as of Kubernetes v1.14.</p>
</td>
</tr>
<tr>
<td>
<code>enableServiceLinks</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>EnableServiceLinks indicates whether information about services should be injected into pod&rsquo;s
environment variables, matching the syntax of Docker links.
Optional: Defaults to true.</p>
</td>
</tr>
<tr>
<td>
<code>preemptionPolicy</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#preemptionpolicy-v1-core">
Kubernetes core/v1.PreemptionPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>PreemptionPolicy is the Policy for preempting pods with lower priority.
One of Never, PreemptLowerPriority.
Defaults to PreemptLowerPriority if unset.
This field is alpha-level and is only honored by servers that enable the NonPreemptingPriority feature.</p>
</td>
</tr>
<tr>
<td>
<code>overhead</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#resourcelist-v1-core">
Kubernetes core/v1.ResourceList
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Overhead represents the resource overhead associated with running a pod for a given RuntimeClass.
This field will be autopopulated at admission time by the RuntimeClass admission controller. If
the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests.
The RuntimeClass admission controller will reject Pod create requests which have the overhead already
set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value
defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero.
More info: <a href="https://git.k8s.io/enhancements/keps/sig-node/20190226-pod-overhead.md">https://git.k8s.io/enhancements/keps/sig-node/20190226-pod-overhead.md</a>
This field is alpha-level as of Kubernetes v1.16, and is only honored by servers that enable the PodOverhead feature.</p>
</td>
</tr>
<tr>
<td>
<code>topologySpreadConstraints</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#topologyspreadconstraint-v1-core">
[]Kubernetes core/v1.TopologySpreadConstraint
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>TopologySpreadConstraints describes how a group of pods ought to spread across topology
domains. Scheduler will schedule pods in a way which abides by the constraints.
This field is alpha-level and is only honored by clusters that enables the EvenPodsSpread
feature.
All topologySpreadConstraints are ANDed.</p>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
<hr/>
<p><em>
Generated with <code>gen-crd-api-reference-docs</code>
on git commit <code>3b35937</code>.
</em></p>
