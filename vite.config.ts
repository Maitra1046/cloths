import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    force: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          // Admin-specific code
          admin: [
            './src/pages/AdminDashboard.tsx',
            './src/components/admin/ProductManagement.tsx',
            './src/components/admin/OrdersTable.tsx',
            './src/components/admin/CollectionManager.tsx'
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Set reasonable limit
  },
}));
