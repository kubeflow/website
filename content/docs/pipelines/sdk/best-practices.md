+++
title = "Best Practices for Designing Components"
description = "Designing and writing components for Kubeflow Pipelines"
weight = 60
+++

This page describes some recommended practices for designing
components. For an application of these best practices, see the
[component development guide](/docs/pipelines/sdk/component-development). If 
you're new to pipelines, see the conceptual guides to 
[pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).

<a id="general">
### General component design rules

*   Design your components with composability in mind. Think about
    upstream and downstream components. What formats to consume as inputs from
    the upstream components. What formats to use for output data so that
    downstream components can consume it.
*   Component code must use local files for input/output data (unless impossible
    - for example, Cloud ML Engine and BigQuery require Cloud Storage staging
    paths).
*   Components must be *pure* - they must not use any outside data except data
    that comes through inputs (unless impossible). Everything should either be
    inside the container or come from inputs. Network access is strongly
    discouraged unless that's the explicit purpose of a component (for example,
    upload/download).

## Writing component code

*   The program must be runnable both locally and inside the Docker
    container.
*   Programming languages:

    *   Generally, use the language that makes the most sense. If the
        component wraps a Java library, then it may make sense to use Java to
        expose that library.
    *   For most new components when the performance is not a concern
        the Python language is preferred (use version 3 wherever possible).
    *   If a component wraps an existing program, it's preferred to
        directly expose the program in the component command line.
    *   If there needs to be some wrapper around the program (small
        pre-processing or post-processing like file renaming), it can be done
        with a shell script.
    *   Follow the best practices for the chosen language.

*   Each output data piece should be written to a separate file (see next line).
*   The input and output file paths must be passed in the command line and
    not hard coded:

    *   Typical command line:

        ```
        program.py --input-data <input path> --output-data <output path> --param 42
        ```

    *   Do NOT hardcode paths in the program:
    
        ```
        open("/output.txt", "w")
        ```

*   For temporary data you should use library functions that create
    temporary files. For example, for Python use
    [https://docs.python.org/3/library/tempfile.html](https://docs.python.org/3/library/tempfile.html).
    Do not just write to the root, or testing will be hard.
*   Design the code to be testable.

## Writing tests

*   Follow the [general rules](#general) section so that writing the tests is
    easier.
*   Use the unit testing libraries that are standard for the language you're
    using.
*   Try to design the component code so that it can be tested using unit tests.
    Do not use network unless necessary

*   Prepare small input data files so that the component code can be tested in
    isolation. For example, for an ML prediction component prepare a small model
    and evaluation dataset.

*   Use testing best practices.

    *   Test the expected behavior of the code. Don't just verify that
        "nothing has changed":

        *   For training you can look at loss at final iteration.
        *   For prediction you can look at the result metrics.
        *   For data augmenting you can check for some desired post-invariants.

*   If the component cannot be tested locally or in isolation, then create a
    small proof-of-concept pipeline that tests the component. You can use
    conditionals to verify the output values of a particular task and only
    enable the "success" task if the results are expected.

## Writing a Dockerfile

*   Follow the 
    [Docker best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

*   Structure the Dockerfile so that the required packages are installed
    first and the main component scripts/binaries are added last. Ideally, split
    the Dockerfile in two parts (base image and component code) so that the
    main component image build is fast and more reliable (not require network
    access).

## Writing a component specification YAML file

For the complete definition of a Kubeflow Pipelines component, see the
[component specification](/docs/pipelines/reference/component-spec/).
When creating your `component.yaml` file, you can look at the definitions for 
some
[existing components](https://github.com/kubeflow/pipelines/search?q=filename%3Acomponent.yaml&unscoped_q=filename%3Acomponent.yaml).

*   Use the `{inputValue: Input name}` command-line placeholder for small
    values that should be directly inserted into the command-line.
*   Use the `{inputPath: Input name}` command-line placeholder for input file
    locations.
*   Use the `{outputPath: Output name}` command-line placeholder for output file
    locations.
*   Specify the full command line in ‘command:' instead of just arguments to the
    entry point.