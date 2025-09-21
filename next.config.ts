import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para resolver problemas com RSC
  serverExternalPackages: ['@ant-design/v5-patch-for-react-19'],
  // Configurações de transpilação
  transpilePackages: ['antd'],
};

export default nextConfig;
