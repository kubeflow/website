+++
title = "Load and Share Components"
description = "Load and use an ecosystem of components"
weight = 8
+++

{{% kfp-v2-keywords %}}

This section describes how to load and use existing components. In this section, "components" refers to both single-step components and pipelines, which can also be [used as components][pipeline-as-component].

IR YAML serves as a portable, sharable computational template. This allows you compile and share your components with others, as well as leverage an ecosystem of existing components.

To use an existing component, you can load it using the [`components`][components-module] module and use it with other components in a pipeline:

```python
from kfp import components

loaded_comp = components.load_component_from_file('component.yaml')

@dsl.pipeline
def my_pipeline():
    loaded_comp()
```

You can also load a component directly from a URL, such as a GitHub URL:

```python
loaded_comp = components.load_component_from_url('https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml')
```

Lastly, you can load a component from a string using [`components.load_component_from_text`][components-load-component-from-text]:

```python
with open('component.yaml') as f:
    component_str = f.read()

loaded_comp = components.load_component_from_text(component_str)
```

Some libraries, such as [Google Cloud Pipeline Components][gcpc] package and provide reusable components in a pip-installable [Python package][gcpc-pypi].

[pipeline-as-component]: /docs/components/pipelines/v2/pipelines/pipeline-basics#pipelines-as-components
[gcpc]: https://cloud.google.com/vertex-ai/docs/pipelines/components-introduction
[gcpc-pypi]: https://pypi.org/project/google-cloud-pipeline-components/
[components-module]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/components.html
[components-load-component-from-text]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/components.html#kfp.components.load_component_from_text