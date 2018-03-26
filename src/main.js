import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon.vue'
import App from './components/App.vue'

Vue.component('icon', Icon)

if (process.env.NODE_ENV !== 'production') {
  axios.defaults.baseURL = process.env.BASE_URL
}
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: (h) => h(App)
})
