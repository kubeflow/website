# Change this to where gen-crd-api-reference-docs is extracted
GEN_DOCS=$HOME/gen-crd-api-reference-docs

# V1beta1
CONTENT_DIR=$GOPATH/src/github.com/kubeflow/website/content/docs/reference/tfjob/v1beta1

echo "+++
title = \"TFJob Common\"
description = \"Reference documentation for TFJob\"
weight = 100
+++" > $CONTENT_DIR/common.md

$GEN_DOCS/gen-crd-api-reference-docs -config $GEN_DOCS/kubeflow-config.json -template-dir $GEN_DOCS/template -api-dir "github.com/kubeflow/tf-operator/pkg/apis/common/v1beta1" -out-file temp_common.md
cat temp_common.md >> $CONTENT_DIR/common.md
rm temp_common.md

echo "+++
title = \"TFJob TensorFlow\"
description = \"Reference documentation for TFJob\"
weight = 100
+++" > $CONTENT_DIR/tensorflow.md

$GEN_DOCS/gen-crd-api-reference-docs -config $GEN_DOCS/kubeflow-config.json -template-dir $GEN_DOCS/template -api-dir "github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1beta1" -out-file temp_tensorflow.md
cat temp_tensorflow.md >> $CONTENT_DIR/tensorflow.md
rm temp_tensorflow.md

# V1beta2
CONTENT_DIR=$GOPATH/src/github.com/kubeflow/website/content/docs/reference/tfjob/v1beta2

echo "+++
title = \"TFJob Common (in development)\"
description = \"Reference documentation for TFJob\"
weight = 100
+++" > $CONTENT_DIR/common.md

$GEN_DOCS/gen-crd-api-reference-docs -config $GEN_DOCS/kubeflow-config.json -template-dir $GEN_DOCS/template -api-dir "github.com/kubeflow/tf-operator/pkg/apis/common/v1beta2" -out-file temp_common.md
cat temp_common.md >> $CONTENT_DIR/common.md
rm temp_common.md

echo "+++
title = \"TFJob TensorFlow (in development)\"
description = \"Reference documentation for TFJob\"
weight = 100
+++" > $CONTENT_DIR/tensorflow.md

$GEN_DOCS/gen-crd-api-reference-docs -config $GEN_DOCS/kubeflow-config.json -template-dir $GEN_DOCS/template -api-dir "github.com/kubeflow/tf-operator/pkg/apis/tensorflow/v1beta2" -out-file temp_tensorflow.md
cat temp_tensorflow.md >> $CONTENT_DIR/tensorflow.md
rm temp_tensorflow.md
