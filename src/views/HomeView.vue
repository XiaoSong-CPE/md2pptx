<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialog = useDialog()
const message = useMessage()
const text = ref('')
const loading = ref(false)

// 获取当前不带端口号的完整url
const url = window.location.href.replace(/:\d+/, '')

function drop(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    const file = e.dataTransfer.files[0]
    if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
      readFile(file)
    } else {
      message.error(t('message.error_format'))
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
          title: t('message.warning_title'),
          content: t('message.warning_content_clear'),
          positiveText: t('message.warning_positive'),
          negativeText: t('message.warning_negative'),
          onPositiveClick: () => {
            text.value = textContent
          }
        })
      } else {
        console.error(t('message.error_read'))
        return
      }
    }
    reader.readAsText(file)
  } else {
    console.error(t('message.error_read'))
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
      console.error(t('message.error_read'))
      return
    }
  }
  input.click()
}

async function getPPTX() {
  // 开始转换，显示loading
  loading.value = true

  // 检查文本框是否为空
  if (text.value === '') {
    message.error(t('message.error_empty'))
    loading.value = false
    return
  }

  // 提示用户，转换需要一定时间
  message.info(t('message.info_convert'))

  let res: Response
  let base64: string

  // 发送请求
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: text.value
    })
    base64 = await res.text()
  } catch (e) {
    console.error(e)
    message.error(t('message.error_convert'))
    loading.value = false
    return
  }

  // 检查返回的base64是否为空
  if (base64 === '') {
    message.error(t('message.error_convert'))
    loading.value = false
    return
  }

  // 下载文件
  const link = document.createElement('a')
  link.href = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`
  link.download = 'slides.pptx'
  link.click()

  // 转换完成，关闭loading
  loading.value = false
}
</script>

<template>
  <div>
    <n-layout embedded position="absolute">
      <n-layout-header style="height: 64px; padding: 24px" bordered>
        <!-- header -->
        <n-space justify="space-between">
          <n-gradient-text type="success">{{ t('message.title') }}</n-gradient-text>
          <n-space><lang-btn /><theme-btn /></n-space>
        </n-space>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px">
        <!-- <n-layout-sider
          bordered
          content-style="padding: 24px;"
          :collapsed-width="0"
          :width="240"
          show-trigger="bar"
          default-collapsed
        >
          undefined
        </n-layout-sider> -->
        <n-layout :native-scrollbar="false">
          <div style="padding: 24px">
            <n-space vertical>
              <n-space justify="space-between">
                <n-button @click="readFileContent" @dragover.prevent @drop="drop">
                  {{ t('btn.read_file') }}
                </n-button>
                <n-button-group
                  ><n-button disabled> {{ t('btn.preview') }} </n-button>
                  <n-button @click="getPPTX" :loading="loading">
                    {{ t('btn.convert') }}
                  </n-button></n-button-group
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
