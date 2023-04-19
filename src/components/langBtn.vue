<template>
  <div>
    <n-dropdown :options="options" @select="handleSelect">
      <n-button quaternary circle>
        <template #icon>
          <n-icon><material-symbols-language /></n-icon>
        </template>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingStore } from '@/stores/setting'
const options = ref([
  {
    label: '自动/Auto',
    key: 'auto'
  },
  {
    label: '中文',
    key: 'zh-CN'
  },
  {
    label: 'English',
    key: 'en-GB'
  }
])

const handleSelect = (key: 'zh-CN' | 'en-GB' | 'auto') => {
  useSettingStore().setLanguage(key)
}
</script>

<style scoped></style>
