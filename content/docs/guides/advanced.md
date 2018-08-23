+++
title = "Advanced Customizations"
description = "Advanced Customizations for Kubeflow"
weight = 10
toc = true
bref= "This guide has information about advanced customizations for Kubeflow."
[menu.docs]
  parent = "guides"
  weight = 100
+++

## Persistent Disks

Frequently data scientists require a POSIX compliant filesystem. For example, most HDF5 libraries require POSIX and don't work with an object store like GCS or S3. Also, when working with teams you might want a shared POSIX filesystem to be mounted into your notebook environments so that data scientists can work collaboratively on the same datasets.

You can provision your own NFS shares and create Persistent Volume and Persistent Volume Claim objects and then attach them to your jupyter notebooks via the disks flag.


Configure jupyterhub to use the disks

```
ks param set --env=cloud jupyterhub disks ${PVC_CLAIM1},${PVC_CLAIM2}
```

Deploy the environment

```
ks apply cloud
```

Start Juptyer
You should see your NFS volumes mounted as `/mnt/${DISK_NAME}`

In a Juptyer cell you can run

```
!df
```

You should see output like the following

```
https://github.com/jlewi/deepvariant_on_k8s
Filesystem                                                     1K-blocks    Used  Available Use% Mounted on
overlay                                                         98884832 8336440   90532008   9% /
tmpfs                                                           15444244       0   15444244   0% /dev
tmpfs                                                           15444244       0   15444244   0% /sys/fs/cgroup
10.11.254.34:/export/pvc-d414c86a-e0db-11e7-a056-42010af00205 1055841280   77824 1002059776   1% /mnt/jlewi-kubeflow-test1
10.11.242.82:/export/pvc-33f0a5b3-e0dc-11e7-a056-42010af00205 1055841280   77824 1002059776   1% /mnt/jlewi-kubeflow-test2
/dev/sda1                                                       98884832 8336440   90532008   9% /etc/hosts
shm                                                                65536       0      65536   0% /dev/shm
tmpfs                                                           15444244       0   15444244   0% /sys/firmware
```
  * Here `jlewi-kubeflow-test1` and `jlewi-kubeflow-test2` are the names of the PVCs.
