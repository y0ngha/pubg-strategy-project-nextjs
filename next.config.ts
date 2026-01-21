import type { NextConfig } from 'next';
import '@infrastructure/config/environment-variables';

const nextConfig: NextConfig = {
    reactCompiler: true,
};

export default nextConfig;
