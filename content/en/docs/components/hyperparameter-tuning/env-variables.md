+++
title = "Environment Variables for Katib Components"
description = "How to set up environment variables for each Katib component"
weight = 50
+++

This page describes information about environment variables for each Katib component. If you want to change Katib installation, you can modify some of these variables.

In the tables below you can see description, default values and mandatory property for all environment variables in each Katib component.
If variable has mandatory property, appropriate Katib component's manifest must have this environment variable.

## Katib Controller

This is the table of environment variables for the [Katib Controller](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/katib-controller/katib-controller.yaml) deployment.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Variable</th>
        <th>Description</th>
        <th>Default Value</th>
        <th>Mandatory</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>KATIB_CORE_NAMESPACE</code></td>
        <td>Base Namespace for all Katib components and default Experiment</td>
        <td><code>metadata.namespace</code></td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>KATIB_SUGGESTION_COMPOSER</code></td>
        <td>Composer for the Katib Suggestions. You can use your own Composer</td>
        <td>general</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_NAMESPACE</code></td>
        <td>Katib DB Manager Namespace</td>
        <td><code>KATIB_CORE_NAMESPACE</code> env variable</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_IP</code></td>
        <td>Katib DB Manager IP</td>
        <td>katib-db-manager</td>
        <td>No</td>
      </tr>
       <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_PORT</code></td>
        <td>Katib DB Manager Port</td>
        <td>6789</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

Katib Controller calls Katib DB Manager with this address expression:

**`KATIB_DB_MANAGER_SERVICE_IP.KATIB_DB_MANAGER_SERVICE_NAMESPACE:KATIB_DB_MANAGER_SERVICE_PORT`**

If you set `KATIB_DB_MANAGER_SERVICE_NAMESPACE=""`, Katib Controller calls Katib DB Manager with this address:

**`KATIB_DB_MANAGER_SERVICE_IP:KATIB_DB_MANAGER_SERVICE_PORT`**

If you want to use your own DB Manager to report Katib metrics, you can change `KATIB_DB_MANAGER_SERVICE_NAMESPACE`, `KATIB_DB_MANAGER_SERVICE_IP` and `KATIB_DB_MANAGER_SERVICE_PORT` variables.

## Katib UI

This is the table of environment variables for the [Katib UI](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/ui/deployment.yaml) deployment.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Variable</th>
        <th>Description</th>
        <th>Default Value</th>
        <th>Mandatory</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>KATIB_CORE_NAMESPACE</code></td>
        <td>Base Namespace for all Katib components and default Experiment</td>
        <td><code>metadata.namespace</code></td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_NAMESPACE</code></td>
        <td>Katib DB Manager Namespace</td>
        <td><code>KATIB_CORE_NAMESPACE</code> env variable</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_IP</code></td>
        <td>Katib DB Manager IP</td>
        <td>katib-db-manager</td>
        <td>No</td>
      </tr>
       <tr>
        <td><code>KATIB_DB_MANAGER_SERVICE_PORT</code></td>
        <td>Katib DB Manager Port</td>
        <td>6789</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

Katib UI calls Katib DB Manager with the same address expression as Katib Controller.

## Katib DB Manager

This is the table of environment variables for the [Katib DB Manager](https://github.com/andreyvelich/katib/blob/doc-katib-config/manifests/v1alpha3/db-manager/deployment.yaml) deployment.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Variable</th>
        <th>Description</th>
        <th>Default Value</th>
        <th>Mandatory</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>DB_NAME</code></td>
        <td>Katib DB Name</td>
        <td>mysql</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>DB_PASSWORD</code></td>
        <td>Katib DB Password</td>
        <td>test</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>DB_USER</code></td>
        <td>Katib DB User</td>
        <td>root</td>
        <td>No</td>
      </tr>
       <tr>
        <td><code>KATIB_MYSQL_DB_HOST</code></td>
        <td>Katib MySQL Host</td>
        <td>katib-mysql</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_MYSQL_DB_PORT</code></td>
        <td>Katib MySQL Port</td>
        <td>3306</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_MYSQL_DB_DATABASE</code></td>
        <td>Katib MySQL Database name</td>
        <td>katib</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

Currently, Katib DB Manager supports only **MySQL** database. You can use your own DB Manager and Database to report metrics.

For the [Katib DB Manager](https://github.com/andreyvelich/katib/blob/doc-katib-config/manifests/v1alpha3/db-manager/deployment.yaml#L29) you can change `DB_PASSWORD` to your own MySQL DB password.

Katib DB Manager creates connection to the DB, using `mysql` driver and this data source name:

**`DB_USER:DB_PASSWORD@tcp(KATIB_MYSQL_DB_HOST:KATIB_MYSQL_DB_PORT)/KATIB_MYSQL_DB_DATABASE?timeout=5s`**

## Katib MySQL DB

For the [Katib MySQL](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/mysql-db/deployment.yaml) we set these environment variables:

- `MYSQL_ROOT_PASSWORD` to a value from [katib-mysql-secrets](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/mysql-db/secret.yaml), which is equal to "test".
- `MYSQL_ALLOW_EMPTY_PASSWORD` as `true`
- `MYSQL_DATABASE` as `katib`.

Check [here](https://github.com/docker-library/docs/tree/master/mysql#environment-variables) about all environment variables for the MySQL Docker image.

Katib MySQL environment variables must be matched with the Katib DB Manager environment variables, it means:

1. `MYSQL_ROOT_PASSWORD` = `DB_PASSWORD`
1. `MYSQL_DATABASE` = `KATIB_MYSQL_DB_DATABASE`
