import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl';
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from "fs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  basicSsl()
  ],
  define: {
    'process.env': {},
  },

  // server: {
  //   host: '192.168.1.67', // Ensure Vite binds to your local network IP
  //   port: 5173,            // Default Vite port
  //   https: {
  //     key: fs.readFileSync('./192.168.1.67-key.pem'),  // Load the private key
  //     cert: fs.readFileSync('./192.168.1.67.pem'),     // Load the certificate
  //   },
  // }
})
