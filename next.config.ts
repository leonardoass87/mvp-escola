import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para resolver problemas com RSC
  serverExternalPackages: ['@ant-design/v5-patch-for-react-19'],
  // Configurações de transpilação
  transpilePackages: ['antd'],
  // Permitir build mesmo com warnings do ESLint
  eslint: {
    ignoreDuringBuilds: true, // Ignorar warnings durante build
  },
  typescript: {
    ignoreBuildErrors: false, // Manter verificação de TypeScript
  },
};

export default nextConfig;
