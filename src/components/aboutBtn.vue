<template>
  <div>
    <n-button quaternary circle @click="showModal = true">
      <template #icon>
        <n-icon>
          <material-symbols-info />
        </n-icon>
      </template>
    </n-button>
    <n-modal
      v-model:show="showModal"
      :auto-focus="false"
      preset="card"
      title="关于"
      style="max-width: 720px"
    >
      <n-p>
        本项目是一个前端框架，用于转换Markdown文档为PPTX文件。本项目自身并不能完成文件转换，后端依靠<n-a
          href="https://sli.dev"
          target="__blanl"
          >slidev</n-a
        >将markdown字符串转换为png，再用<n-a
          href="https://gitbrent.github.io/PptxGenJS"
          target="__blanl"
          >pptxgenjs</n-a
        >将png转换为pptx文件。本项目只是前端整合了上述两个项目，提供了一个可视化的界面。
      </n-p>
      <n-p
        >下面展示了一个简单的示例代码，<n-a href="/example.pptx" target="__blank">点击此处</n-a
        >查看示例代码转换后的文件。</n-p
      >
      <n-code
        language="markdown"
        show-line-numbers
        :code="`
# Title

subtitle

---

# Title of Page 2

Subtitle of page 2

First paragraph of page 2.

Second paragraph of page 2.

---

# Title of Page 3

Subtitle of page 3

- Unordered Lists Item 1: **bold text**.
- Unordered Lists Item item 2: _italic text_.
- Unordered Lists Item item 3: **_italic and bold text_**.

---

# Title of Page 4

Subtitle of page 4

1. Ordered Lists Item 1.
2. Ordered Lists Item 2.
3. Ordered Lists Item 3.
        `"
      ></n-code>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
</script>

<style scoped></style>
