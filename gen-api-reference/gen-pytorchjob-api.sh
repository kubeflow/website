# Change this to where gen-crd-api-reference-docs is extracted
GEN_DOCS=${HOME}/gen-crd-api-reference-docs

# Change this to where the website repository is cloned.
WEBSITE_ROOT=${GOPATH}/src/github.com/kubeflow/website

# V1beta1
CONTENT_DIR=${WEBSITE_ROOT}/content/docs/reference/pytorchjob/v1beta1

echo "+++
title = \"PyTorchJob\"
description = \"Reference documentation for PyTorchJob\"
weight = 100
+++" > ${CONTENT_DIR}/pytorch.md

${GEN_DOCS}/gen-crd-api-reference-docs -config ${WEBSITE_ROOT}/gen-api-reference/kubeflow-config.json -template-dir ${GEN_DOCS}/template -api-dir "github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1beta1" -out-file temp_pytorch.md
cat temp_pytorch.md >> ${CONTENT_DIR}/pytorch.md
rm temp_pytorch.md

# V1beta2
CONTENT_DIR=${WEBSITE_ROOT}/content/docs/reference/pytorchjob/v1beta2

echo "+++
title = \"PyTorchJob\"
description = \"Reference documentation for PyTorchJob\"
weight = 100
+++" > ${CONTENT_DIR}/pytorch.md

${GEN_DOCS}/gen-crd-api-reference-docs -config ${WEBSITE_ROOT}/gen-api-reference/kubeflow-config.json -template-dir ${GEN_DOCS}/template -api-dir "github.com/kubeflow/pytorch-operator/pkg/apis/pytorch/v1beta2" -out-file temp_pytorch.md
cat temp_pytorch.md >> ${CONTENT_DIR}/pytorch.md
rm temp_pytorch.md
