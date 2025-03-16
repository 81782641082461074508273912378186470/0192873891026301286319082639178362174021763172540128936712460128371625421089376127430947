import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/tentang-kami',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/harga',
        destination: '/maintenance',
        permanent: false,
      },
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
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/daftar',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/kyc',
        destination:
          'https://docs.google.com/forms/d/e/1FAIpQLSd2kB_IuT51S5u3iImu9Fjw_aiOQwkeUy7VRaSNN8qqrIsagw/viewform?usp=sharing',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
