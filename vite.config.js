// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				index: '/index.html',
				details: '/movie-details.html',
				search: '/search.html',
			},
		},
	},
});
