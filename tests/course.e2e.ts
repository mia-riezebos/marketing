import { expect, test } from '@playwright/test';

import { courseData } from '../src/lib/generated/course-data';

test('all lesson and template routes are reachable', async ({ request }) => {
	for (const lesson of courseData.lessons) {
		const response = await request.get(`/lessons/${lesson.slug}`);
		expect(response.ok(), `Lesson route failed: ${lesson.slug}`).toBeTruthy();
	}

	for (const template of courseData.templates) {
		const response = await request.get(`/templates/${template.id}`);
		expect(response.ok(), `Template route failed: ${template.id}`).toBeTruthy();
	}

	expect((await request.get('/sources')).ok()).toBeTruthy();
	expect((await request.get('/search?q=seo')).ok()).toBeTruthy();
});

test('start, complete, continue, reload, and resume persist locally', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: /Start the course/i }).click();

	await expect(page).toHaveURL(/\/lessons\/start-here$/);
	await expect(page.getByRole('heading', { name: 'Start here' })).toBeVisible();

	await page.getByRole('button', { name: /Bookmark lesson/i }).click();
	await page.getByLabel(/Private notes for this lesson/i).fill(
		'Remember the four labels and the no-streak rule.'
	);
	await page.getByRole('link', { name: /What “done” looks like in this course/i }).click();
	await expect(page).toHaveURL(/#what-done-looks-like-in-this-course$/);
	await page.getByRole('button', { name: /Mark lesson done/i }).click();
	await page.getByRole('link', { name: /Next on the core path/i }).click();

	await expect(page).toHaveURL(/\/lessons\/what-marketing-is$/);
	await page.getByRole('link', { name: /A concrete example/i }).click();
	await expect(page).toHaveURL(/#a-concrete-example$/);

	await page.reload();
	await expect(page).toHaveURL(/#a-concrete-example$/);

	await page.goto('/');
	const resumeLink = page.getByRole('link', { name: /Resume where you left off/i });
	await expect(resumeLink).toHaveAttribute(
		'href',
		/\/lessons\/what-marketing-is#a-concrete-example/
	);

	await page.goto('/lessons/start-here');
	await expect(page.getByRole('button', { name: /Remove bookmark/i })).toBeVisible();
	await expect(page.getByLabel(/Private notes for this lesson/i)).toHaveValue(
		'Remember the four labels and the no-streak rule.'
	);
});

test('search finds lessons and tactics', async ({ page }) => {
	await page.goto('/search?q=positioning');
	await expect(page.getByRole('heading', { name: /results/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Make the difference obvious/i })).toBeVisible();
});

test('template copy and download are usable', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/templates/one-page-strategy');

	await page.getByRole('button', { name: /Copy markdown/i }).click();
	await expect(page.getByText(/copied to your clipboard/i)).toBeVisible();
	const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
	expect(clipboardText.toLowerCase()).toContain('one-page strategy');

	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: /Download \.md/i }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe('one-page-strategy.md');
});

test('credit and source links open originals safely', async ({ page }) => {
	await page.goto('/lessons/what-marketing-is');
	await page.getByText(/Credits and evidence/i).click();

	const creditLink = page.locator('.credits-panel a').first();
	await expect(creditLink).toHaveAttribute('target', '_blank');
	await expect(creditLink).toHaveAttribute('rel', /noopener/);
	await expect(creditLink).toHaveAttribute('rel', /noreferrer/);

	await page.goto('/sources');
	const sourceLink = page.getByRole('link', { name: /Open original source/i }).first();
	await expect(sourceLink).toHaveAttribute('target', '_blank');
	await expect(sourceLink).toHaveAttribute('rel', /noopener/);
});

test.describe('mobile menu and keyboard support', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('shows a mobile menu and skip link', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.locator('.skip-link')).toBeFocused();

		await page.getByRole('button', { name: /Menu/i }).click();
		await expect(page.getByRole('link', { name: 'Templates' })).toBeVisible();
	});
});

test('gracefully handles malformed saved progress', async ({ browser }) => {
	const context = await browser.newContext();
	await context.addInitScript(() => {
		window.localStorage.setItem('marketing-course-progress-v1', '{bad json');
	});

	const page = await context.newPage();
	await page.goto('/');
	await expect(page.getByText(/Unreadable saved progress was reset/i)).toBeVisible();
	await expect(page.getByRole('link', { name: /Start the course/i })).toBeVisible();
	await context.close();
});

test('gracefully handles unavailable browser storage', async ({ browser }) => {
	const context = await browser.newContext();
	await context.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			get() {
				throw new Error('blocked');
			}
		});
	});

	const page = await context.newPage();
	await page.goto('/');
	await expect(page.getByText(/Browser storage is unavailable here/i)).toBeVisible();
	await expect(page.getByRole('link', { name: /Start the course/i })).toBeVisible();
	await context.close();
});
