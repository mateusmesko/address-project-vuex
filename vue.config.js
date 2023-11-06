const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://viacep.com.br/ws/',
        changeOrigin: true,
      },
    },
  },
};
