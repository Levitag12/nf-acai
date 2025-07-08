// client/postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-nesting': {}, // <-- Corrigido aqui
    tailwindcss: {},
    autoprefixer: {},
  },
};