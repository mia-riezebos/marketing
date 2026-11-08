<script lang="ts">
	import { onMount, tick } from 'svelte';

	import CreditsPanel from '../../../lib/components/CreditsPanel.svelte';
	import LessonVisualExplainer from '../../../lib/components/LessonVisualExplainer.svelte';
	import SectionNav from '../../../lib/components/SectionNav.svelte';
	import { moduleStyle } from '../../../lib/course/learning-design';
	import { progressState } from '../../../lib/course/progress';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let activeSectionId = $state<string | null>(null);

	const lessonProgress = $derived($progressState.snapshot.lessons[data.lesson.id]);
	const isDone = $derived(lessonProgress?.status === 'done');

	const syncActiveSection = (sectionId: string | null) => {
		activeSectionId = sectionId;
		progressState.setLastSection(data.lesson.id, sectionId);
		if (sectionId) {
			history.replaceState(history.state, '', `#${sectionId}`);
		}
	};

	const jumpToSection = async (sectionId: string) => {
		await tick();
		document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
		syncActiveSection(sectionId);
	};

	onMount(() => {
		progressState.markOpened(data.lesson.id);

		let observer: IntersectionObserver | null = null;

		void (async () => {
			await tick();

			const savedSection = $progressState.snapshot.lessons[data.lesson.id]?.last_section_id;
			const hashSection = window.location.hash
				? decodeURIComponent(window.location.hash.slice(1))
				: null;
			const initialSection = hashSection || savedSection || data.lesson.sections[0]?.id || null;

			if (initialSection && !hashSection) {
				document.getElementById(initialSection)?.scrollIntoView({ block: 'start' });
			}

			activeSectionId = initialSection;

			const targets = data.lesson.sections
				.map((section: { id: string }) => document.getElementById(section.id))
				.filter((element: HTMLElement | null): element is HTMLElement => Boolean(element));

			if (!targets.length) {
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					const visible = entries
						.filter((entry) => entry.isIntersecting)
						.sort((left, right) => right.intersectionRatio - left.intersectionRatio);

					const current = visible[0]?.target.id;
					if (!current || current === activeSectionId) {
						return;
					}

					syncActiveSection(current);
				},
				{
					rootMargin: '-18% 0px -58% 0px',
					threshold: [0.15, 0.4, 0.75]
				}
			);

			targets.forEach((target: HTMLElement) => observer?.observe(target));
		})();

		return () => observer?.disconnect();
	});
</script>

<svelte:head>
	<title>{data.lesson.title} · Marketing course</title>
	<meta content={data.lesson.summary} name="description" />
</svelte:head>

<div class="page page--lesson">
	<div class="lesson-hero surface" style={data.design ? moduleStyle(data.design) : undefined}>
		<div class="lesson-hero__copy">
			<p class="eyebrow">
				{data.lesson.moduleId === 'start' ? 'Start here' : `Part ${data.lesson.part}`} · {data.lesson.moduleTitle}
			</p>
			<h1>{data.lesson.title}</h1>
			<p class="lede">{data.lesson.summary}</p>
			{#if data.design}
				<p class="muted">{data.design.intent}</p>
			{/if}

			<div class="lesson-hero__meta">
				<span class="chip">{data.lesson.readMin} min read</span>
				<span class="chip">{data.lesson.actionMin} min action</span>
				<span class="chip">{data.lesson.sections.length || 1} chunks</span>
				{#if data.lesson.optional}
					<span class="chip">Optional</span>
				{/if}
			</div>

			{#if data.design}
				<p class="fine-print">
					<a href={`/modules/${data.design.slug}`}>Open the {data.design.title} module overview</a>
				</p>
			{/if}
		</div>

		<div class="lesson-hero__actions">
			<button class="button" onclick={() => progressState.toggleDone(data.lesson.id)} type="button">
				{isDone ? 'Mark as not done yet' : 'Mark lesson done'}
			</button>
			<button
				class="button button--ghost"
				onclick={() => progressState.toggleBookmark(data.lesson.id)}
				type="button"
			>
				{lessonProgress?.bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
			</button>
			<p class="fine-print">
				Saved privately on this device. Completion is a memory aid, not a quota.
			</p>
		</div>
	</div>

	<div class="lesson-layout">
		<aside class="lesson-sidebar">
			<div class="surface surface--nested takeaway-card">
				<p class="eyebrow">Takeaway</p>
				<p>{data.lesson.takeaway}</p>
			</div>

			<div class="surface surface--nested task-card">
				<h2>Under 2 minutes</h2>
				<p>{data.lesson.minAction}</p>
				<p class="muted">Output: {data.lesson.minActionOutput}</p>
			</div>

			<div class="surface surface--nested task-card">
				<h2>Optional exercise</h2>
				<p>{data.lesson.exercise}</p>
				<p class="muted">
					About {data.lesson.exerciseMin} minutes · Output: {data.lesson.exerciseOutput}
				</p>
			</div>

			<div class="surface surface--nested task-card">
				<h2>You're done when</h2>
				<p>{data.lesson.stopWhen}</p>
			</div>

			<SectionNav
				activeSectionId={activeSectionId}
				lessonSlug={data.lesson.slug}
				onJump={jumpToSection}
				sections={data.lesson.sections}
			/>
		</aside>

		<div class="lesson-main">
			<LessonVisualExplainer lessonId={data.lesson.id} />

			<section class="surface">
				<label class="notes-field">
					<span class="eyebrow">Private notes</span>
					<textarea
						aria-label="Private notes for this lesson"
						oninput={(event) =>
							progressState.setNotes(data.lesson.id, (event.currentTarget as HTMLTextAreaElement).value)}
						placeholder="Write what clicked, what to try, or where you want to come back."
					>{lessonProgress?.notes ?? ''}</textarea>
				</label>
			</section>

			<section class="surface">
				<article class="lesson-content prose">
					{@html data.lesson.html}
				</article>
			</section>

			<CreditsPanel items={data.lesson.creditItems} />

			<nav aria-label="Related lessons" class="related-nav surface">
				<div class="related-nav__grid">
					{#if data.previousLesson}
						<a class="inline-card" href={`/lessons/${data.previousLesson.slug}`}>
							<span class="eyebrow">Previous</span>
							<strong>{data.previousLesson.title}</strong>
							<span>{data.previousLesson.summary}</span>
						</a>
					{/if}

					{#if data.nextCoreLesson}
						<a class="inline-card" href={`/lessons/${data.nextCoreLesson.slug}`}>
							<span class="eyebrow">Next on the core path</span>
							<strong>{data.nextCoreLesson.title}</strong>
							<span>{data.nextCoreLesson.summary}</span>
						</a>
					{:else if data.optionalNeighbors.next}
						<a class="inline-card" href={`/lessons/${data.optionalNeighbors.next.slug}`}>
							<span class="eyebrow">Next optional lesson</span>
							<strong>{data.optionalNeighbors.next.title}</strong>
							<span>{data.optionalNeighbors.next.summary}</span>
						</a>
					{/if}
				</div>
			</nav>
		</div>
	</div>
</div>
