<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, useDialog } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()
let text = ref('')

function drop(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    const file = e.dataTransfer.files[0]
    if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
      readFile(file)
    } else {
      message.error('文件格式不正确')
      return
    }
  }
}

function readFile(file: File) {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const textContent = e.target?.result
      if (typeof textContent === 'string') {
        // 弹出对话框，告知用户会清除原有内容
        dialog.warning({
          autoFocus: false,
          title: '警告',
          content: '导入文件会清除原有内容，是否继续？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            text.value = textContent
          }
        })
      } else {
        console.error('读取文件失败')
        return
      }
    }
    reader.readAsText(file)
  } else {
    console.error('读取文件失败')
    return
  }
}

function readFileContent() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'text/*, .md'
  input.onchange = () => {
    if (input.files) {
      const file = input.files[0]
      readFile(file)
    } else {
      console.error('读取文件失败')
      return
    }
  }
  input.click()
}
</script>

<template>
  <div>
    <n-layout embedded position="absolute">
      <n-layout-header style="height: 64px; padding: 24px" bordered>
        <!-- header -->
        <n-space justify="space-between">
          <n-gradient-text type="success">{{ $t('message.title') }}</n-gradient-text>
          <n-space><lang-btn /><theme-btn /></n-space>
        </n-space>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px">
        <n-layout-sider
          bordered
          content-style="padding: 24px;"
          :collapsed-width="0"
          :width="240"
          show-trigger="bar"
          default-collapsed
        >
          海淀桥
        </n-layout-sider>
        <n-layout :native-scrollbar="false">
          <div style="padding: 24px">
            <n-space vertical>
              <n-space justify="space-between">
                <n-button @click="readFileContent" @dragover.prevent @drop="drop">
                  从文件导入
                </n-button>
                <n-button-group
                  ><n-button disabled> 预览 </n-button> <n-button> 转换 </n-button></n-button-group
                >
              </n-space>
              <n-input type="textarea" :autosize="{ minRows: 5 }" v-model:value="text" />
            </n-space>
          </div>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>
