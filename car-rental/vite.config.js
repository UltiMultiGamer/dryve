import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	preview: {
		allowedHosts: ['dryve.onrender.com', '.onrender.com']
	},
	ssr: {
		noExternal: ['bits-ui']
	}
});
