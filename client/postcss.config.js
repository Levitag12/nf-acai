import tailwindcss from 'tailwindcss/postcss'; // ✅ novo caminho para Tailwind 4+
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss, autoprefixer],
};
