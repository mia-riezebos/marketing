<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let query = $state('');

	$effect(() => {
		query = data.query;
	});
</script>

<svelte:head>
	<title>Search · Marketing course</title>
</svelte:head>

<div class="page">
	<section class="surface">
		<p class="eyebrow">Search</p>
		<h1>Find lessons, tactics, templates, and sources</h1>
		<p class="muted">
			Search reaches lesson titles, section names, teaching-item statements, template text, and
			source backlinks.
		</p>

		<form class="search-form" method="GET">
			<label class="search-field">
				<span class="sr-only">Search query</span>
				<input bind:value={query} name="q" placeholder="Try: positioning, SEO, homepage, agents" type="search" />
			</label>
			<button class="button" type="submit">Search</button>
		</form>
	</section>

	<section class="surface">
		<div class="section-heading">
			<h2>{data.results.length ? `${data.results.length} results` : 'No results yet'}</h2>
			{#if query.trim()}
				<p class="muted">Showing matches for “{query.trim()}”.</p>
			{:else}
				<p class="muted">Start with a topic, tactic, creator, or worksheet name.</p>
			{/if}
		</div>

		{#if data.results.length}
			<ul class="search-results">
				{#each data.results as result}
					<li>
						<a class="inline-card" href={result.url}>
							<div class="lesson-list__title-row">
								<strong>{result.title}</strong>
								<span class="chip">{result.kind.replace('-', ' ')}</span>
							</div>
							<span>{result.excerpt}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
