<template>
  <div class="docx-preview">
    <!-- 加载提示 -->
    <div v-if="loading" class="status">📄 正在加载文档，请稍候...</div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="status error">
      ❌ 文档加载失败，请检查文件地址是否正确。
    </div>

    <!-- 渲染的 Word 内容 -->
    <div ref="container" v-else class="preview-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { renderAsync } from "docx-preview";

const props = defineProps({
  /** 线上 docx 文件地址 */
  url: {
    type: String,
    required: true,
  },
});

const container = ref(null);
const loading = ref(true);
const error = ref(false);

/**
 * 加载并渲染 docx 文件
 */
const loadDocx = async () => {
  loading.value = true
  error.value = false

  try {
    const response = await fetch(props.url);
    if (!response.ok) throw new Error("文件获取失败")

    const blob = await response.blob()
    // 渲染到容器中
    await renderAsync(blob, container.value, null, {
      className: 'docx', // 样式前缀
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: false
    })

    loading.value = false
  } catch (err) {
    console.error('❌ 预览失败：', err)
    error.value = true
    loading.value = false
  }
}

onMounted(loadDocx)

// 监听 url 变化（如果外部传入的文件变更）
watch(() => props.url, loadDocx)
</script>

<style scoped>
.docx-preview {
  width: 100%;
  min-height: 800px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
  padding: 10px;
}

.preview-container {
  background: white;
  padding: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 800px;
  font-size: 16px;
  color: #555;
}

.status.error {
  color: #d9534f;
}
</style>