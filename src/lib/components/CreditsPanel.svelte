<script lang="ts">
	import { attributionLabel, creditKindLabel } from '../course/labels';

	type CreditItem = {
		id: string;
		statement: string;
		kind: string;
		attribution: string;
		notes: string | null;
		sources: readonly {
			source_id: string;
			creator: string;
			url: string | null;
			credit_role: string;
			retrieval_status: string;
			archive_status: string;
		}[];
		informed_by: readonly {
			source_id: string;
			creator: string;
			url: string | null;
		}[];
	};

	type Props = {
		items: readonly CreditItem[];
	};

	let { items }: Props = $props();
</script>

<details class="credits-panel">
	<summary>
		<span>Credits and evidence</span>
		<span>{items.length} teaching items</span>
	</summary>

	<div class="credits-panel__body">
		<p class="muted">
			Methods, creator claims, findings, and the course's own synthesis stay separate here so
			you can audit where each lesson line came from.
		</p>

		<ul class="credits-list">
			{#each items as item}
				<li class="credit-card">
					<div class="credit-card__meta">
						<span class="eyebrow">{creditKindLabel[item.kind] ?? item.kind}</span>
						<span class="chip">{attributionLabel[item.attribution] ?? item.attribution}</span>
					</div>

					<p class="credit-card__statement">{item.statement}</p>

					{#if item.notes}
						<p class="credit-card__notes">{item.notes}</p>
					{/if}

					{#if item.sources.length}
						<div class="credit-card__sources">
							<h3>Direct sources</h3>
							<ul>
								{#each item.sources as source}
									<li>
										{#if source.url}
											<a href={source.url} rel="noreferrer noopener" target="_blank">
												{source.creator}
											</a>
										{:else}
											<span>{source.creator}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if item.informed_by.length}
						<div class="credit-card__sources">
							<h3>Shaped by</h3>
							<ul>
								{#each item.informed_by as source}
									<li>
										{#if source.url}
											<a
												href={source.url}
												rel="noreferrer noopener"
												target="_blank"
											>
												{source.creator}
											</a>
										{:else}
											<span>{source.creator}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</details>
