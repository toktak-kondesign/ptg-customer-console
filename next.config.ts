import type { NextConfig } from 'next'

// เว็บถูก deploy ไว้ที่ subpath /Customer-console/ บน IIS
// ต้องกำหนด basePath ให้ Next.js เพื่อให้ asset (Image, Link, Script) prefix path ถูกต้อง
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  basePath,
  allowedDevOrigins: ['127.0.0.1', 'localhost','kds-app.kondesign.net','ptgdata-api.kondesign.net','depwn2021.ptg.co.th','ptg.co.th'],
  images: {
    // IIS ไม่สามารถ serve Next.js Image Optimizer endpoint (/_next/image) ได้
    // ปิด optimizer เพื่อให้ <Image> render เป็น <img> ตรงจาก /images/...
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

export default nextConfig
