import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSettingStore = defineStore('setting', () => {
  const theme = useLocalStorage('theme', 'auto')
  const language = useLocalStorage('language', 'auto')
  const setTheme = (value: 'light' | 'dark' | 'auto') => {
    console.log(value)
    theme.value = value
  }
  const setLanguage = (value: 'de' | 'zh' | 'en' | 'auto') => {
    console.log(value)
    const lang = value === 'auto' ? navigator.language : value
    language.value = lang
  }
  return { theme, language, setTheme, setLanguage }
})
