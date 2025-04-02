import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{ 
  remotePatterns:[
  {
    hostname: 'utfs.io',
    port:'',
    protocol:'https',
  },
 ],
},
  reactStrictMode: true,
  transpilePackages: ["geist"],
};

export default nextConfig;
