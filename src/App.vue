<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOsTheme, darkTheme, zhCN, dateZhCN, enGB, dateEnGB, deDE, dateDeDE } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import hljs from 'highlight.js'
// 获取pinia setting store
import { useSettingStore } from '@/stores/setting'
const { locale } = useI18n()
let theme = ref(useSettingStore().$state.theme)
let language = ref(useSettingStore().$state.language)
useSettingStore().$subscribe((mutation, state) => {
  theme.value = state.theme
  language.value = state.language
  locale.value = state.language === 'auto' ? navigator.language : state.language
})

const themeConfig = computed(() => {
  if (theme.value === 'auto') {
    return useOsTheme().value === 'dark' ? darkTheme : null
  } else {
    return theme.value === 'dark' ? darkTheme : null
  }
})
const languageConfig = computed(() => {
  const lang = language.value === 'auto' ? navigator.language : language.value
  return lang === 'zh' ? zhCN : lang === 'en' ? enGB : lang === 'de' ? deDE : null
})
const dataLanguageConfig = computed(() => {
  const lang = language.value === 'auto' ? navigator.language : language.value
  return lang === 'zh' ? dateZhCN : lang === 'en' ? dateEnGB : lang === 'de' ? dateDeDE : null
})
</script>

<template>
  <div>
    <NConfigProvider
      :theme="themeConfig"
      :locale="languageConfig"
      :date-locale="dataLanguageConfig"
      :hljs="hljs"
    >
      <NLoadingBarProvider>
        <NDialogProvider>
          <NNotificationProvider>
            <NMessageProvider>
              <RouterView />
            </NMessageProvider>
          </NNotificationProvider>
        </NDialogProvider>
      </NLoadingBarProvider>
    </NConfigProvider>
  </div>
</template>
