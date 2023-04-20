import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import messages from './locales/index';
// 配置vue-i18n
const i18n = createI18n({
    messages,
    legacy: false,
    fallbackLocale: 'en-GB',
    locale: localStorage.getItem('language') || 'auto',
});
import App from './App.vue';
import router from './router';
import './assets/main.less';
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');
