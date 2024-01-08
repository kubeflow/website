+++
title = "Local Execution"
description = "Execute KFP components locally"
weight = 9
+++

{{% kfp-v2-keywords %}}

## Overview
KFP supports executing components locally, enabling a tight development loop before running your components remotely.

Executing components locally is easy. Simply initialize a local session using `local.init()`, then call the component. KFP will log information about the execution. Once execution completes, you can access the task outputs just as you would when composing a pipeline; the only difference is that the outputs are now materialized outputs, not references to future outputs.

In the following example, we use the `DockerRunner` type. Runner types are covered in more detail below.

```python
from kfp import local
from kfp import dsl

local.init(runner=local.DockerRunner())

@dsl.component
def add(a: int, b: int) -> int:
    return a + b

task = add(a=1, b=2)
assert task.output == 3
```

Similarly, you can create artifacts and read the contents:
```python
from kfp import local
from kfp import dsl
from kfp.dsl import Output, Artifact
import json

local.init(runner=local.SubprocessRunner())

@dsl.component
def add(a: int, b: int, out_artifact: Output[Artifact]):
    import json

    result = json.dumps(a + b)

    with open(out_artifact.path, 'w') as f:
        f.write(result)

    out_artifact.metadata['operation'] = 'addition'


task = add(a=1, b=2)
# can read artifact contents
with open(task.outputs['out_artifact'].path) as f:
    contents = f.read()
assert json.loads(contents) == 3
assert task.outputs['out_artifact'].metadata['operation'] == 'addition'
```

By default, KFP will raise an exception if your component exits with a failure status. You can toggle this behavior using `raise_on_error`. You can also specify a new local "pipeline root" using `pipeline_root`. This is the local directory to which component outputs, including artifacts, are written.

```python
local.init(runner=...,
           raise_on_error=False,
           pipeline_root='~/my/component/outputs')
```

## Local runners

You can choose from two local runner types which indicate how and where your component should be executed: `DockerRunner` and `SubprocessRunner`.

### Recommended: DockerRunner

When invoking components locally using the `DockerRunner`, the task will execute in a container. Because of this, the local `DockerRunner`:
- Offers the strongest form of local runtime environment isolation
- Is most faithful to the remote runtime environment
- Allows execution of all component types: [Lightweight Python Component][lightweight-python-component], [Containerized Python Components][containerized-python-components], and [Container Components][container-components]

**It is recommended to use `DockerRunner` whenever possible.**

When you use `DockerRunner`, KFP mounts your local pipeline root to the container. This means that your component outputs will still be available for inspection within pipeline root after the container exits.

The `DockerRunner` requires [Docker to be installed](https://docs.docker.com/engine/install/), but requires essentially no knowledge of Docker to use.

### Alternative: SubprocessRunner

The `SubprocessRunner` is recommended when executing components in local environments where Docker cannot be installed, such as in most notebook environments.

The `SubprocessRunner` runs your code in a subprocess. The `SubprocessRunner`:
- Offers less local runtime environment isolation than the `DockerRunner`
- Does not easily enable complex dependencies and does not support custom images
- Only allows execution of [Lightweight Python Component][lightweight-python-component]

By default, the `SubprocessRunner` will install your dependencies into a virtual environment. This is recommended, but can be disabled by setting `use_venv=False`:

```python
from kfp import local

local.init(runner=local.SubprocessRunner(use_venv=False))
```


[lightweight-python-component]: /docs/components/pipelines/v2/components/lightweight-python-components
[containerized-python-components]: /docs/components/pipelines/v2/components/containerized-python-components
[container-components]: /docs/components/pipelines/v2/components/container-components



