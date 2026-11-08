<script lang="ts">
	import { archiveLabel, retrievalLabel } from '../../lib/course/labels';
	import { normalizeSearchText } from '../../lib/course/text';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let query = $state('');

	const filteredSources = $derived(
		data.sources.filter((source) => {
			const haystack = normalizeSearchText(
				[
					source.creator,
					source.handle,
					source.title,
					source.kind,
					...(source.limitations ?? []),
					...source.backlinks.map((backlink) => backlink.lessonTitle)
				]
					.filter(Boolean)
					.join(' ')
			);
			return !query.trim() || haystack.includes(normalizeSearchText(query));
		})
	);
</script>

<svelte:head>
	<title>Source library · Marketing course</title>
</svelte:head>

<div class="page">
	<section class="surface">
		<p class="eyebrow">Source library</p>
		<h1>Sources and limitations</h1>
		<p class="lede">
			Every source kept for this app-safe library, with retrieval limitations and backlinks to the
			lesson items that cite it.
		</p>

		<label class="search-field">
			<span class="sr-only">Filter sources</span>
			<input bind:value={query} placeholder="Filter by creator, source title, lesson, or topic" type="search" />
		</label>
	</section>

	<section class="surface">
		<div class="section-heading">
			<h2>{filteredSources.length} sources shown</h2>
			<p class="muted">
				Original links open in a new tab. Limited or partial coverage stays labeled instead of being
				smoothed over.
			</p>
		</div>

		<ul class="source-list">
			{#each filteredSources as source}
				<li class="source-card" id={source.id}>
					<div class="source-card__header">
						<div>
							<p class="eyebrow">{source.kind}</p>
							<h3>{source.title}</h3>
							<p class="muted">
								{source.creator}{source.handle ? ` · ${source.handle}` : ''}
							</p>
						</div>
						<div class="source-card__chips">
							<span class="chip">{retrievalLabel[source.retrieval_status] ?? source.retrieval_status}</span>
							<span class="chip">{archiveLabel[source.archive_status] ?? source.archive_status}</span>
						</div>
					</div>

					<div class="source-card__body">
						{#if source.url}
							<p>
								<a href={source.url} rel="noreferrer noopener" target="_blank">Open original source</a>
							</p>
						{/if}

						{#if source.limitations?.length}
							<div>
								<h4>Coverage notes</h4>
								<ul>
									{#each source.limitations as limitation}
										<li>{limitation}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div>
							<h4>Lesson backlinks</h4>
							{#if source.backlinks.length}
								<ul>
									{#each source.backlinks as backlink}
										<li>
											<a href={`/lessons/${backlink.lessonSlug}`}>{backlink.lessonTitle}</a>
											<span class="muted"> — {backlink.statement}</span>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="muted">This source is preserved in the library but not cited by a teaching item.</p>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</div>
