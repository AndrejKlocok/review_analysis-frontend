module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: '42023',
    public: '0.0.0.0:42023',
    disableHostCheck: true
  },
}
