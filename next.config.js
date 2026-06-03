/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  allowedDevOrigins: ['192.168.101.40'],
}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA(nextConfig)