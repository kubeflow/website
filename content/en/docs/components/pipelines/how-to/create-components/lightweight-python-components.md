+++
title = "Lightweight Python Components"
description = "Create a component from a self-contained Python function"
weight = 1
+++

{{% kfp-v2-keywords %}}

The easiest way to get started authoring components is by creating a Lightweight Python Component. We saw an example of a Lightweight Python Component with `say_hello` in the [Hello World pipeline example][hello-world-pipeline]. Here is another Lightweight Python Component that adds two integers together:

```python
from kfp import dsl

@dsl.component
def add(a: int, b: int) -> int:
    return a + b
```

Lightweight Python Components are constructed by decorating Python functions with the [`@dsl.component`][dsl-component] decorator. The `@dsl.component` decorator transforms your function into a KFP component that can be executed as a remote function by a KFP conformant-backend, either independently or as a single step in a larger pipeline.

### Python function requirements
To decorate a function with the `@dsl.component` decorator it must meet two requirements:

1. **Type annotations:** The function inputs and outputs must have valid KFP [type annotations][data-types].

    There are two categories of inputs and outputs in KFP: [parameters][parameters] and [artifacts][artifacts]. There are specific types of parameters and artifacts within each category. Every input and output will have a specific type indicated by its type annotation.

    In the preceding `add` component, both inputs `a` and `b` are parameters typed `int`. There is one output, also typed `int`.

    Valid parameter annotations include Python's built-in `int`, `float`, `str`, `bool`, `typing.Dict`, and `typing.List`. Artifact annotations are discussed in detail in [Data Types: Artifacts][artifacts].

2. **Hermetic:** The Python function may not reference any symbols defined outside of its body.

    For example, if you wish to use a constant, the constant must be defined inside the function:

    ```python
    @dsl.component
    def double(a: int) -> int:
        """Succeeds at runtime."""
        VALID_CONSTANT = 2
        return VALID_CONSTANT * a
    ```

    By comparison, the following is invalid and will fail at runtime:

    ```python
    # non-example!
    INVALID_CONSTANT = 2

    @dsl.component
    def errored_double(a: int) -> int:
        """Fails at runtime."""
        return INVALID_CONSTANT * a
    ```

    Imports must also be included in the function body:

    ```python
    @dsl.component
    def print_env():
        import os
        print(os.environ)
    ```

    For many realistic components, hermeticism can be a fairly constraining requirement. [Containerized Python Components][containerized-python-components] is a more flexible authoring approach that drops this requirement.

### dsl.component decorator arguments
In the above examples, we used the [`@dsl.component`][dsl-component] decorator with only one argument: the Python function. The decorator accepts some additional arguments.

#### packages_to_install

Most realistic Lightweight Python Components will depend on other Python libraries. You can pass a list of requirements to `packages_to_install` and the component will install these packages at runtime before executing the component function.

This is similar to including requirements in a [`requirements.txt`][requirements-txt] file.

```python
@dsl.component(packages_to_install=['numpy==1.21.6'])
def sin(val: float = 3.14) -> float:
    return np.sin(val).item()
```

**Note:** As a production software best practice, prefer using [Containerized Python Components][containerized-python-components] when your component specifies `packages_to_install` to eliminate installation of your dependencies at runtime.

#### pip_index_urls

`pip_index_urls` exposes the ability to pip install `packages_to_install` from package indices other than the default [PyPI.org][pypi-org].

When you set `pip_index_urls`, KFP passes these indices to [`pip install`][pip-install]'s [`--index-url`][pip-index-url] and [`--extra-index-url`][pip-extra-index-url] options. It also sets each index as a `--trusted-host`.

Take the following component:

```python
@dsl.component(packages_to_install=['custom-ml-package==0.0.1', 'numpy==1.21.6'],
               pip_index_urls=['http://myprivaterepo.com/simple', 'http://pypi.org/simple'],
)
def comp():
    from custom_ml_package import model_trainer
    import numpy as np
    ...
```

These arguments approximately translate to the following `pip install` command:

```sh
pip install custom-ml-package==0.0.1 numpy==1.21.6 kfp==2 --index-url http://myprivaterepo.com/simple --trusted-host http://myprivaterepo.com/simple --extra-index-url http://pypi.org/simple --trusted-host http://pypi.org/simple
```

Note that when you set `pip_index_urls`, KFP does not include `'https://pypi.org/simple'` automatically. If you wish to pip install packages from a private repository _and_ the default public repository, you should include both the private and default URLs as shown in the preceding component `comp`.

#### base_image

When you create a Lightweight Python Component, your Python function code is extracted by the KFP SDK to be executed inside a container at pipeline runtime. By default, the container image used is [`python:3.7`](https://hub.docker.com/_/python). You can override this image by providing an argument to `base_image`. This can be useful if your code requires a specific Python version or other dependencies not included in the default image.

```python
@dsl.component(base_image='python:3.8')
def print_py_version():
    import sys
    print(sys.version)
```

#### install_kfp_package

`install_kfp_package` can be used together with `pip_index_urls` to provide granular control over installation of the `kfp` package at component runtime.

By default, Python Components install `kfp` at runtime. This is required to define symbols used by your component (such as [artifact annotations][artifacts]) and to access additional KFP library code required to execute your component remotely. If `install_kfp_package` is `False`, `kfp` will not be installed via the normal automatic mechanism. Instead, you can use `packages_to_install` and `pip_index_urls` to install a different version of `kfp`, possibly from a non-default pip index URL.

Note that setting `install_kfp_package` to `False` is rarely necessary and is discouraged for the majority of use cases.

[hello-world-pipeline]: /docs/components/pipelines/overview/getting-started
[containerized-python-components]: /docs/components/pipelines/how-to/create-components/containerized-python-components
[dsl-component]: https://kubeflow-pipelines.readthedocs.io/en/stable/source/dsl.html#kfp.dsl.component
[data-types]: /docs/components/pipelines/v2/data-types
[parameters]: /docs/components/pipelines/how-to/parameters
[artifacts]: /docs/components/pipelines/how-to/artifacts
[requirements-txt]: https://pip.pypa.io/en/stable/reference/requirements-file-format/
[pypi-org]: https://pypi.org/
[pip-install]: https://pip.pypa.io/en/stable/cli/pip_install/
[pip-index-url]: https://pip.pypa.io/en/stable/cli/pip_install/#cmdoption-0
[pip-extra-index-url]: https://pip.pypa.io/en/stable/cli/pip_install/#cmdoption-extra-index-url