<script lang="ts">
	type Section = {
		id: string;
		title: string;
	};

	type Props = {
		sections: readonly Section[];
		activeSectionId: string | null;
		lessonSlug: string;
		onJump?: (sectionId: string) => void;
	};

	let { sections, activeSectionId, lessonSlug, onJump }: Props = $props();
</script>

{#if sections.length}
	<nav aria-label="Lesson sections" class="section-nav">
		<div class="section-nav__header">
			<h2>Sections</h2>
			<p>Jump to a chunk and come back later without losing your place.</p>
		</div>

		<ol>
			{#each sections as section}
				<li>
					<a
						class:section-nav__link--active={activeSectionId === section.id}
						class="section-nav__link"
						href={`/lessons/${lessonSlug}#${section.id}`}
						onclick={() => onJump?.(section.id)}
					>
						<span>{section.title}</span>
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}
