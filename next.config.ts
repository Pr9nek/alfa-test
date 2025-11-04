import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Список доменов, с которых разрешено загружать внешние изображения
    domains: [
      'cdn.dummyjson.com'
      // Если у вас есть другие внешние источники, добавьте их сюда.
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
