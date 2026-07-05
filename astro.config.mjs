import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://garrethdean.com",
  output: "static",
  markdown: {
    syntaxHighlight: false,
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "connect-src 'self' https://eomail5.com https://www.google.com",
        "font-src 'self' https://fonts.gstatic.com",
        "form-action 'self' https://eomail5.com",
        "frame-src https://www.google.com",
        "img-src 'self' data: https://www.google.com https://www.gstatic.com",
        "media-src 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", "https://eomail5.com", "https://www.google.com", "https://www.gstatic.com"],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      },
    },
  },
});
