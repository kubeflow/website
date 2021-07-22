+++
title = "MLRun Serving"
description = "Model serving with MLRun"
weight = 45

+++                 


MLRun serving graphs allow you to build real-time data processing and advanced model serving pipelines and deploy them quickly to production with minimal effort.

The serving graphs can be composed of pre-defined graph blocks or native python classes/functions. Graphs can auto-scale and span multiple function containers.

Graphs can run inside your IDE or Notebook for test and simulation and can be deployed into production serverless pipeline with a single command.


### Accelerate performance and time to production

MLRun's underline serverless engine ([Nuclio](https://nuclio.io/)) uses a high-performance parallel processing engine that maximizes the utilization of CPUs and GPUs. 

MLRun allows developers to focus on code and deploy faster by supporting: 

- 13 protocols and invocation methods (HTTP, Cron, Kafka, Kinesis, etc...), 
- Dynamic auto-scaling for http and streaming,
- Full life cycle--including auto-generation of micro-services, APIs, load-balancing, logging, monitoring, and configuration management.

### Further Documentation

- [Examples](https://docs.mlrun.org/en/latest/serving/serving-graph.html#examplesL)
	- [Simple model serving router](https://docs.mlrun.org/en/latest/serving/serving-graph.html#simple-model-serving-router)
	- [Advanced data processing and serving ensemble](https://docs.mlrun.org/en/latest/serving/serving-graph.html#advanced-data-processing-and-serving-ensemble)
	- [NLP processing pipeline with real-time streaming](https://docs.mlrun.org/en/latest/serving/serving-graph.html#nlp-processing-pipeline-with-real-time-streaming)
- [The Graph State Machine](https://docs.mlrun.org/en/latest/serving/serving-graph.html#the-graph-state-machine)
	- [Graph overview and usage](https://docs.mlrun.org/en/latest/serving/serving-graph.html#graph-overview-and-usage) 
	- [Graph context and Event objects](https://docs.mlrun.org/en/latest/serving/serving-graph.html#graph-context-and-event-objects)
	- [Error handling and catchers](https://docs.mlrun.org/en/latest/serving/serving-graph.html#error-handling-and-catchers) 
	- [Implement your own task class or function](https://docs.mlrun.org/en/latest/serving/serving-graph.html#error-handling-and-catchers)
	- [Building distributed graphs](https://docs.mlrun.org/en/latest/serving/serving-graph.html#building-distributed-graphs)
