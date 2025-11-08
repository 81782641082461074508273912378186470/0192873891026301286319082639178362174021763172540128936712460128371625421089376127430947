import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    const isDev = process.env.NODE_ENV !== 'production';
    const dashboardBase = isDev
      ? 'http://localhost:3001/dashboard'
      : 'https://dashboard.autolaku.com';
    return [
      {
        source: '/fitur',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/blog',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/bantuan',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/faq',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/hubungi-kami',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/masuk',
        destination: 'https://dashboard.autolaku.com/auth',
        permanent: true,
      },
      {
        source: '/daftar',
        destination: `${dashboardBase}/auth`,
        permanent: false,
      },
      {
        source: '/staff/kyc',
        destination: 'https://forms.gle/aqhWKYU862xqtiCb8',
        permanent: false,
      },
      {
        source: '/staff/katakata',
        destination:
          'https://docs.google.com/document/d/1Oryv93pKzKy68JS02Rm7Vt7vlYacWDoGE6WlrWat44w/edit?tab=t.0',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
