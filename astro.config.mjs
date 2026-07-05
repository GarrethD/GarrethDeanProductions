import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const supabaseOrigin = process.env.PUBLIC_SUPABASE_URL
  ? new URL(process.env.PUBLIC_SUPABASE_URL).origin
  : "https://zxrboenwwbrmkwksswji.supabase.co";

export default defineConfig({
  site: "https://garrethdean.com",
  output: "static",
  integrations: [react()],
  markdown: {
    syntaxHighlight: false,
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        `connect-src 'self' ${supabaseOrigin}`,
        "font-src 'self' https://fonts.gstatic.com",
        "form-action 'self'",
        "frame-src 'none'",
        "img-src 'self' data:",
        "media-src 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'"],
      },
      styleDirective: {
        resources: ["'self'", "https://fonts.googleapis.com"],
      },
    },
  },
});
