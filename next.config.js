/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: (process.env.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "").replace(/["',]/g, '').trim(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: (process.env.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "").replace(/["',]/g, '').trim(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: (process.env.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").replace(/["',]/g, '').trim(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: (process.env.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").replace(/["',]/g, '').trim(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: (process.env.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "").replace(/["',]/g, '').trim(),
    NEXT_PUBLIC_FIREBASE_APP_ID: (process.env.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "").replace(/["',]/g, '').trim(),
  },
};

module.exports = nextConfig;
