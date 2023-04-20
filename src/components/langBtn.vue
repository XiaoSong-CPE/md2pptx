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
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const options = computed(() => [
  {
    label: t('btn.lang.auto'),
    key: 'auto'
  },
  {
    label: t('btn.lang.zh'),
    key: 'zh'
  },
  {
    label: t('btn.lang.en'),
    key: 'en'
  },
  {
    label: t('btn.lang.de'),
    key: 'de'
  }
])

const handleSelect = (key: 'de' | 'zh' | 'en' | 'auto') => {
  useSettingStore().setLanguage(key)
}
</script>

<style scoped></style>
