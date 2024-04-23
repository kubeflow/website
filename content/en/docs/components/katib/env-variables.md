+++
title = "Environment Variables for Katib Components"
description = "How to set up environment variables for each Katib component"
weight = 80
                    
+++

This guide describes environment variables for each Katib component.
If you want to change your Katib installation,
you can modify some of these variables.

In the tables below you can find descriptions, default values and mandatory
properties for all environment variables in each Katib component.
If a variable has a mandatory property, you need to set the relevant
environment variable in an appropriate Katib component's manifest.

## Katib Controller

Bellow are the environment variables for the
[Katib Controller](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/controller/controller.yaml)
deployment:

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
        <td> <a href="https://github.com/kubeflow/katib/blob/master/pkg/controller.v1beta1/suggestion/composer/composer.go">Composer</a>
          for the Katib Suggestions. You can use your own Composer</td>
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

Below are the environment variables for the
[Katib UI](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/ui/ui.yaml)
deployment:

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

Bellow are the environment variables for the
[Katib DB Manager](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/db-manager/db-manager.yaml)
deployment:

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
        <td>Katib DB Name: 'mysql' or 'postgres'</td>
        <td>  </td> 
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>DB_PASSWORD</code></td>
        <td>Katib DB Password</td>
        <td>test (MySQL)<br>katib (Postgres)</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><code>DB_USER</code></td>
        <td>Katib DB User</td>
        <td>root (MySQL)<br>katib (Postgres)</td>
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
      <tr>
        <td><code>KATIB_POSTGRESQL_DB_HOST</code></td>
        <td>Katib Postgres Host</td>
        <td>katib-postgres</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_POSTGRESQL_DB_PORT</code></td>
        <td>Katib Postgres Port</td>
        <td>5432</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_POSTGRESQL_DB_DATABASE</code></td>
        <td>Katib Postgres Database name</td>
        <td>katib</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>KATIB_POSTGRESQL_SSL_MODE</code></td>
        <td>Katib Postgres SSL mode</td>
        <td>disable</td>
        <td>No</td>
      </tr>
      <tr>
        <td><code>SKIP_DB_INITIALIZATION</code></td>
        <td>Option to skip DB table initialization</td>
        <td>false</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

Currently, Katib DB Manager supports only **MySQL** and **Postgres** database. (`DB_NAME` env variable must be filled with one of `mysql` or `postgres`)  
However, you can use your own DB Manager and Database to report metrics by implements the [katib db interface](https://github.com/kubeflow/katib/blob/master/pkg/db/v1beta1/common/kdb.go).

For the [Katib DB Manager](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/db-manager/db-manager.yaml#L25)
you can change `DB_PASSWORD` to your own DB password.

Katib DB Manager creates DB connection to the DB by the type of DB.  
If `DB_NAME=mysql`, it uses `mysql` driver and this data source name:  
**`DB_USER:DB_PASSWORD@tcp(KATIB_MYSQL_DB_HOST:KATIB_MYSQL_DB_PORT)/KATIB_MYSQL_DB_DATABASE?timeout=5s`**

If `DB_NAME=postgres`, it uses `pq` driver and this data source name:  
**`postgresql://[DB_USER[:DB_PASSWORD]@][KATIB_POSTGRESQL_DB_HOST][:KATIB_POSTGRESQL_DB_PORT][/KATIB_POSTGRESQL_DB_DATABASE]`**

## Katib DB

Katib DB components supports MySQL and Postgres.

### Katib MySQL

For the [Katib MySQL](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/mysql/mysql.yaml)
you need to set these environment variables:

- `MYSQL_ROOT_PASSWORD` to a value from [katib-mysql-secrets](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/mysql/secret.yaml),
  which is equal to "test".
- `MYSQL_ALLOW_EMPTY_PASSWORD` as `true`
- `MYSQL_DATABASE` as `katib`.

You can refer to the list of
[all environment variables](https://github.com/docker-library/docs/tree/master/mysql#environment-variables)
for the MySQL Docker image.

Katib MySQL environment variables must be matched with the Katib DB Manager environment variables, it means:

1. `MYSQL_ROOT_PASSWORD` = `DB_PASSWORD`
1. `MYSQL_DATABASE` = `KATIB_MYSQL_DB_DATABASE`

### Katib Postgres

For the [Katib Postgres](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/postgres/postgres.yaml)
you need to set these environment variables:

- `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` to a value from [katib-postgres-secrets](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/postgres/secret.yaml),
  which are equal to "katib".

You can refer to the list of
[all environment variables](https://github.com/docker-library/docs/blob/master/postgres/README.md#environment-variables)
for the Postgres Docker image.

Katib Postgres environment variables must be matched with the Katib DB Manager environment variables, it means:

1. `POSTGRES_USER` = `DB_USER`
1. `POSTGRES_PASSWORD` = `DB_PASSWORD`
1. `POSTGRES_DB` = `KATIB_POSTGRESQL_DB_DATABASE`
