import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSettingStore = defineStore('setting', () => {
  const theme = useLocalStorage('theme', 'auto')
  const language = useLocalStorage('language', 'auto')
  const setTheme = (value: 'light' | 'dark' | 'auto') => {
    console.log(value);
    theme.value = value
  }
  const setLanguage = (value: 'zh-CN' | 'en-GB' | 'auto') => {
    console.log(value);
    language.value = value
  }
  return { theme, language, setTheme, setLanguage }
})
