<script lang="ts">
	import { moduleDesignById } from '../course/learning-design';

	type Props = {
		moduleId: string;
	};

	let { moduleId }: Props = $props();
	const design = $derived(moduleDesignById.get(moduleId) ?? null);
</script>

{#if design}
<figure class="module-figure surface surface--nested">
	<figcaption class="module-figure__caption">
		<p class="eyebrow">Learning map</p>
		<h2>How this module fits together</h2>
	</figcaption>

	{#if design.figureMode === 'grid'}
		<div class="module-figure__grid">
			{#each design.figureItems as item}
				<div class="module-figure__card">
					<h3>{item.title}</h3>
					<p>{item.detail}</p>
				</div>
			{/each}
		</div>
	{:else if design.figureMode === 'path'}
		<ol class="module-figure__path">
			{#each design.figureItems as item}
				<li><strong>{item.title}</strong><span>{item.detail}</span></li>
			{/each}
		</ol>
	{:else}
		<div class="module-figure__rail">
			{#each design.figureItems as item, index}
				<div class="module-figure__card">
					<h3>{item.title}</h3>
					<p>{item.detail}</p>
				</div>
				{#if index < design.figureItems.length - 1}
					<div class="module-figure__arrow" aria-hidden="true">→</div>
				{/if}
			{/each}
		</div>
	{/if}
</figure>
{/if}
