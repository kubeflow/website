+++
title = "Experiment"
description = "Conceptual overview of experiments in Kubeflow Pipelines"
weight = 40
                    
+++

An *experiment* is like a folder for your runs and recurring runs. You can archive and 
unarchive an experiment. When archiving an experiment, all runs in it will be archived, 
and all recurring runs disabled. However, when you unarchive an experiment, the runs remain 
archived, and the recurring runs remain disabled.

During the initialization of Kubeflow Pipelines, an experiment called `default` is automatically
created. All runs and recurring runs without a specified experiment will belong to `default`.

## Next steps

* Learn more about [pipelines](pipeline)
* [Hello World Pipeline][hello-world-pipeline]
* Learn more about [authoring components][components]
* Learn more about [authoring pipelines][author-pipelines]

[pipeline]: /docs/components/pipelines/v2/concepts/pipeline
[components]: /docs/components/pipelines/v2/components
[author-pipelines]: /docs/components/pipelines/v2/pipelines
[hello-world-pipeline]: /docs/components/pipelines/v2/hello-world