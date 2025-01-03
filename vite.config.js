// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',  // Allow access from any external IP
//     port: 5173         // You can change this if you need to use a different port
//   }
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allow access from any external IP
    port: 5173, // Use your desired port
    proxy: {
      "/users": {
        target: "http://ec2-3-219-12-193.compute-1.amazonaws.com:5001",
        changeOrigin: true,
        secure: false,
      },
      "/qna": {
        target: "http://ec2-3-219-12-193.compute-1.amazonaws.com:5001",
        changeOrigin: true,
        secure: false,
      },
      "/feedback": {
        target: "http://ec2-3-219-12-193.compute-1.amazonaws.com:5001",
        changeOrigin: true,
        secure: false,
      },
      "/dashboard": {
        target: "http://ec2-3-219-12-193.compute-1.amazonaws.com:5001",
        changeOrigin: true,
        secure: false,
      },
      // Wildcard for any other routes
      "/api": {
        target: "http://ec2-3-219-12-193.compute-1.amazonaws.com:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove `/api` prefix if needed
      },
    },
  },
});
