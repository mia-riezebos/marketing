<script lang="ts">
	import { getProgressCounts, progressState } from '../../lib/course/progress';

	const snapshot = $derived($progressState.snapshot);
	const counts = $derived(getProgressCounts(snapshot));
	let message = $state('Export a backup or merge in another backup. Imports validate before changing anything.');

	const exportData = () => {
		const blob = new Blob([progressState.exportProgress()], { type: 'application/json;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'marketing-course-progress.json';
		anchor.click();
		URL.revokeObjectURL(url);
		message = 'Progress exported from this browser.';
	};

	const importData = async (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const text = await file.text();
		const result = progressState.importProgress(text);
		message = result.message;
		input.value = '';
	};
</script>

<svelte:head>
	<title>Settings · Marketing course</title>
</svelte:head>

<div class="page">
	<section class="surface">
		<p class="eyebrow">Settings</p>
		<h1>Local progress and backups</h1>
		<p class="lede">
			This course keeps progress in the browser by default. There is no account and no cross-device
			sync.
		</p>
	</section>

	<section class="surface settings-grid">
		<div class="surface surface--nested">
			<h2>Current browser totals</h2>
			<ul class="plain-list">
				<li>{counts.done} lessons marked done</li>
				<li>{counts.inProgress} lessons in progress</li>
				<li>{counts.bookmarked} bookmarked lessons</li>
			</ul>
		</div>

		<div class="surface surface--nested">
			<h2>Backup tools</h2>
			<div class="cta-row">
				<button class="button" onclick={exportData} type="button">Export progress</button>
				<label class="button button--ghost button--file">
					<span>Import progress</span>
					<input accept="application/json" onchange={importData} type="file" />
				</label>
			</div>
			<p aria-live="polite" class="fine-print">{message}</p>
		</div>

		<div class="surface surface--nested">
			<h2>Reset this browser copy</h2>
			<p class="muted">
				Use only if you want to clear this browser’s lesson state, bookmarks, and notes.
			</p>
			<button class="button button--ghost" onclick={() => progressState.resetProgress()} type="button">
				Clear local progress
			</button>
		</div>
	</section>
</div>
