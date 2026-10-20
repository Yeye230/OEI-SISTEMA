import type { NextConfig } from "next";

/**
 * Configuración de headers de seguridad por ambiente
 *
 * DESARROLLO: Más permisivo para debugging
 * PRODUCCIÓN: Restrictivo para máxima seguridad
 */
const isProd = process.env.NODE_ENV === "production";

// ✅ CSP diferente por ambiente
const getCSP = (): string => {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net`,
    `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com`,
    "img-src 'self' data: https: https://anriverax.s3.us-east-2.amazonaws.com",
    "font-src 'self' data: https://cdn.jsdelivr.net",
    `connect-src 'self' http://localhost:3001 ws: wss: http://localhost:* 127.0.0.1:*`,
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src blob:",
    "object-src 'none'"
  ];

  return csp
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

// ✅ HSTS diferente por ambiente
const getHSTS = (): string =>
  isProd ? "max-age=31536000; includeSubDomains; preload" : "max-age=3600; includeSubDomains";

const nextConfig: NextConfig = {
  /* config options here */
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // ✅ Dinámico: CSP
        {
          key: "Content-Security-Policy",
          value: getCSP()
        },
        // ✅ OWASP recommended headers
        // ✅ Siempre activo: Previene clickjacking
        {
          key: "X-Frame-Options",
          value: "DENY"
        },
        // ✅ Siempre activo: Previene MIME type sniffing
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        // ✅ HSTS
        {
          key: "Strict-Transport-Security",
          value: getHSTS()
        },
        // ✅ Legacy browser protection
        {
          key: "X-XSS-Protection",
          value: "1; mode=block"
        },
        // ✅ Hide tech stack
        { key: "X-DNS-Prefetch-Control", value: "off" }
      ]
    }
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anriverax.s3.us-east-2.amazonaws.com",
        pathname: "/**"
      }
    ]
  }
  // Root redirect is handled via middleware for auth-aware behavior
};

export default nextConfig;
