import { defineConfig } from "taze";

export default defineConfig({
	// we don't want to use beta version of these packages
	exclude: ["nestjs-tsx-views", "express-tsx-views"],
});
