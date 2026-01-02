export function getWidgetConfigString(BASE_URL, embeddingDbName, apiKey, dataIngestionConfigId, modelConfigId) {
  return `<!-- RAG Service Widget -->
<script>
  window.RAG_CONFIG = {
    RAG_CONFIG_KEY: "${embeddingDbName}",
    RAG_API_BASE: "${BASE_URL}",
    RAG_API_KEY: "${apiKey || 'YOUR_API_KEY'}",
    RAG_INGESTION_CONFIG_ID: "${dataIngestionConfigId || ''}",
    RAG_MODEL_CONFIG_ID: "${modelConfigId || ''}"
  };
</script>
<script src="${BASE_URL}/widget.js"></script>`
}
