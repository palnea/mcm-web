/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
