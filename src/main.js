import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n';

Vue.config.productionTip = false

Vue.use(VueI18n);

const messages = {
	'pt-BR': require('@/i18n/pt-BR.json')
};

const i18n = new VueI18n({
	locale: 'pt-BR', // Defina o idioma padrão
	messages
});

new Vue({
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
