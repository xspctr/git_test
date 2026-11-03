import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            framer: new URL("./tests/framer-runtime.ts", import.meta.url).pathname,
        },
    },
})
