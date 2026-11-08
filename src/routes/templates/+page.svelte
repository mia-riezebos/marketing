<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Templates · Marketing course</title>
</svelte:head>

<div class="page">
	<section class="surface">
		<p class="eyebrow">Worksheets</p>
		<h1>Templates</h1>
		<p class="lede">
			Twelve copy-ready worksheets drawn from the course. Open any template to preview, copy, or
			download it.
		</p>
	</section>

	<section class="surface">
		<div class="bookmark-grid">
			{#each data.templates as template}
				<a class="inline-card" href={`/templates/${template.id}`}>
					<strong>{template.title}</strong>
					<span>{template.id}.md</span>
				</a>
			{/each}
		</div>
	</section>
</div>
