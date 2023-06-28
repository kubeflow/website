+++
title = "Pipelines"
description = "Author KFP pipelines"
weight = 5
+++

{{% kfp-v2-keywords %}}

A *pipeline* is a definition of a workflow containing one or more tasks, including how tasks relate to each other to form a computational graph. Pipelines may have inputs which can be passed to tasks within the pipeline and may surface outputs created by tasks within the pipeline. Pipelines can themselves be used as components within other pipelines.