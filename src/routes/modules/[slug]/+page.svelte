<script lang="ts">
	import ModuleOverviewFigure from '../../../lib/components/ModuleOverviewFigure.svelte';
	import { moduleStyle } from '../../../lib/course/learning-design';
	import { progressState } from '../../../lib/course/progress';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const snapshot = $derived($progressState.snapshot);

	const continueLesson = $derived.by(() => {
		const inProgress = data.module.lessons.find(
			(lesson) => snapshot.lessons[lesson.id]?.status === 'in_progress'
		);
		if (inProgress) return inProgress;

		const nextUnstarted = data.module.lessons.find(
			(lesson) => (snapshot.lessons[lesson.id]?.status ?? 'unstarted') === 'unstarted'
		);
		return nextUnstarted ?? data.module.lessons[data.module.lessons.length - 1];
	});

	const doneCount = $derived(
		data.module.lessons.filter((lesson) => snapshot.lessons[lesson.id]?.status === 'done').length
	);
</script>

<svelte:head>
	<title>{data.design.title} · Module</title>
</svelte:head>

<div class="page">
	<section class="module-page-hero surface" style={moduleStyle(data.design)}>
		<div class="module-page-hero__copy">
			<p class="eyebrow">{data.design.kicker}</p>
			<h1>{data.design.title}</h1>
			<p class="lede">{data.design.intro}</p>
			<p class="muted">{data.design.intent}</p>

			<div class="cta-row">
				<a class="button" href={`/lessons/${continueLesson.slug}`}>
					{doneCount === data.module.lessons.length ? 'Review this module' : 'Continue this module'}
				</a>
				<a class="button button--ghost" href="/">Back to course map</a>
			</div>
		</div>

		<div class="module-page-hero__meta">
			<div class="surface surface--nested module-page-hero__stat">
				<span class="stat-card__value">{doneCount}</span>
				<span class="stat-card__label">Lessons done here</span>
			</div>
			<div class="surface surface--nested module-page-hero__stat">
				<span class="stat-card__value">{data.module.lessons.length}</span>
				<span class="stat-card__label">Lessons in this module</span>
			</div>
		</div>
	</section>

	<ModuleOverviewFigure moduleId={data.module.id} />

	<div class="module-page-grid">
		<section class="surface">
			<p class="eyebrow">What this module helps you answer</p>
			<h2>Core questions</h2>
			<ul class="module-question-list">
				{#each data.design.questions as question}
					<li>{question}</li>
				{/each}
			</ul>
		</section>

		<section class="surface">
			<p class="eyebrow">How to use it</p>
			<h2>Practice focus</h2>
			<p>{data.design.practice}</p>
			<p class="muted">{data.design.diagramLabel}</p>
		</section>
	</div>

	<section class="surface">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Lesson arc</p>
				<h2>This module, step by step</h2>
			</div>
			<p class="muted">Each lesson stays small; together they build the module’s mental model.</p>
		</div>

		<ol class="lesson-list">
			{#each data.module.lessons as lesson}
				<li>
					<a class="lesson-list__item" href={`/lessons/${lesson.slug}`}>
						<div class="lesson-list__title-row">
							<strong>{lesson.title}</strong>
							<span class={`lesson-status lesson-status--${snapshot.lessons[lesson.id]?.status ?? 'unstarted'}`}>
								{snapshot.lessons[lesson.id]?.status ?? 'unstarted'}
							</span>
						</div>
						<p>{lesson.summary}</p>
						<div class="lesson-list__meta">
							<span>{lesson.readMin} min read</span>
							<span>{lesson.actionMin} min action</span>
						</div>
					</a>
				</li>
			{/each}
		</ol>
	</section>
</div>
