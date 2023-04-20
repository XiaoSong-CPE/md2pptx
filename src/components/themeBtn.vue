<template>
  <div>
    <n-dropdown :options="options" @select="handleSelect">
      <n-button quaternary circle>
        <template #icon>
          <n-icon>
            <material-symbols-dark-mode v-if="theme === 'dark'" />
            <material-symbols-light-mode v-else-if="theme === 'light'" />
            <material-symbols-brightness-medium v-else />
          </n-icon>
        </template>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
let theme = ref(useSettingStore().$state.theme)

const options = ref([
  {
    label: t('btn.theme.auto'),
    key: 'auto'
  },
  {
    label: t('btn.theme.light'),
    key: 'light'
  },
  {
    label: t('btn.theme.dark'),
    key: 'dark'
  }
])

const handleSelect = (key: 'light' | 'dark' | 'auto') => {
  useSettingStore().setTheme(key)
}
useSettingStore().$subscribe((mutation, state) => {
  theme.value = state.theme
})
</script>

<style scoped></style>
