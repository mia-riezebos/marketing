<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let copyMessage = $state('Copy the markdown or download it as a file.');

	const copyTemplate = async () => {
		try {
			await navigator.clipboard.writeText(data.template.markdown);
			copyMessage = 'Template copied to your clipboard.';
		} catch {
			copyMessage = 'Clipboard access failed here. Download the file instead.';
		}
	};

	const downloadTemplate = () => {
		const blob = new Blob([data.template.markdown], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = data.template.downloadName;
		anchor.click();
		URL.revokeObjectURL(url);
	};
</script>

<svelte:head>
	<title>{data.template.title} · Template</title>
</svelte:head>

<div class="page">
	<section class="surface template-hero">
		<div>
			<p class="eyebrow">Template</p>
			<h1>{data.template.title}</h1>
			<p class="muted">
				Copy this into your own notes app, markdown editor, or local file. Nothing syncs off-device
				unless you move it yourself.
			</p>
		</div>

		<div class="cta-row">
			<button class="button" onclick={copyTemplate} type="button">Copy markdown</button>
			<button class="button button--ghost" onclick={downloadTemplate} type="button">
				Download .md
			</button>
		</div>

		<p aria-live="polite" class="fine-print">{copyMessage}</p>
	</section>

	<div class="template-layout">
		<section class="surface">
			<h2>Preview</h2>
			<article class="prose template-preview">
				{@html data.template.html}
			</article>
		</section>

		<section class="surface">
			<h2>Raw markdown</h2>
			<pre class="template-raw"><code>{data.template.markdown}</code></pre>
		</section>
	</div>
</div>
