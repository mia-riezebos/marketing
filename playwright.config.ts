import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	testMatch: '**/*.e2e.{ts,js}',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true
	}
});
