<script lang="ts">
	import { moduleDesignById, moduleStyle } from '../lib/course/learning-design';
	import { getProgressCounts, getResumeHref, progressState } from '../lib/course/progress';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	type ModuleLesson = (typeof data.modules)[number]['lessons'][number];
	const snapshot = $derived($progressState.snapshot);
	const progressCounts = $derived(getProgressCounts(snapshot));
	const resumeHref = $derived(getResumeHref(snapshot));
	const allLessons = $derived.by(
		() => data.modules.flatMap((module) => [...module.lessons]) as ModuleLesson[]
	);
	const resumeLesson = $derived(
		snapshot.last_lesson_id
			? allLessons.find((lesson) => lesson.id === snapshot.last_lesson_id) ?? allLessons[0]
			: allLessons[0]
	);
	const bookmarkedLessons = $derived(
		allLessons.filter((lesson) => snapshot.lessons[lesson.id]?.bookmarked)
	);
	const coreModules = $derived(data.modules.filter((module) => !module.optional));
	const optionalModules = $derived(data.modules.filter((module) => module.optional));
</script>

<svelte:head>
	<title>{data.course.title}</title>
	<meta content={data.course.description} name="description" />
</svelte:head>

<div class="page">
	<section class="hero surface">
		<div class="hero__copy">
			<p class="eyebrow">Mobile-first, calm, and built for stopping anytime</p>
			<h1>{data.course.title}</h1>
			<p class="lede">{data.course.description}</p>
			<p class="muted">
				Learn the durable principles and cheap sharp tactics without a wall of text, fake
				gamification, or pressure to keep a streak alive.
			</p>

			<div class="cta-row">
				<a class="button" href={resumeHref}>{snapshot.last_lesson_id ? 'Resume where you left off' : 'Start the course'}</a>
				<a class="button button--ghost" href="/search">Search lessons and tactics</a>
			</div>

			<p class="fine-print">
				Progress, bookmarks, and notes stay on this browser and device unless you export them.
			</p>
		</div>

		<div class="hero__aside">
			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-card__value">{progressCounts.done}</span>
					<span class="stat-card__label">Done</span>
				</div>
				<div class="stat-card">
					<span class="stat-card__value">{progressCounts.inProgress}</span>
					<span class="stat-card__label">In progress</span>
				</div>
				<div class="stat-card">
					<span class="stat-card__value">{progressCounts.bookmarked}</span>
					<span class="stat-card__label">Bookmarked</span>
				</div>
				<div class="stat-card">
					<span class="stat-card__value">{data.course.counts.total_lessons}</span>
					<span class="stat-card__label">Lessons</span>
				</div>
			</div>

			<div class="surface surface--nested">
				<h2>Next up</h2>
				{#if resumeLesson}
					<a class="inline-card" href={resumeHref}>
						<strong>{resumeLesson.title}</strong>
						<span>{resumeLesson.summary}</span>
					</a>
				{/if}
			</div>
		</div>
	</section>

	{#if bookmarkedLessons.length}
		<section class="surface">
			<div class="section-heading">
				<div>
					<p class="eyebrow">Quick return</p>
					<h2>Your bookmarks</h2>
				</div>
			</div>

			<div class="bookmark-grid">
				{#each bookmarkedLessons as lesson}
					<a class="inline-card" href={`/lessons/${lesson.slug}`}>
						<strong>{lesson.title}</strong>
						<span>{lesson.summary}</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<section class="surface">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Ordered path</p>
				<h2>Course journey</h2>
			</div>
			<p class="muted">
				Follow the modules in order. Each one has its own orientation page so the learner sees
				what they are trying to understand before they drop into lesson detail.
			</p>
		</div>

		<div class="module-stack">
			{#each coreModules as module}
				<section class="module-card module-card--journey" style={moduleStyle(moduleDesignById.get(module.id)!)}>
					<header class="module-card__header">
						<div>
							<p class="eyebrow">{module.id === 'start' ? 'Orientation' : `Part ${module.id}`}</p>
							<h3>{module.title}</h3>
							<p class="muted">{moduleDesignById.get(module.id)?.intro}</p>
						</div>
						<span class="chip">{module.lessons.length} lesson{module.lessons.length === 1 ? '' : 's'}</span>
					</header>

					<div class="module-card__journey">
						<ul class="module-question-list">
							{#each moduleDesignById.get(module.id)?.questions ?? [] as question}
								<li>{question}</li>
							{/each}
						</ul>

						<div class="module-card__lessons">
							{#each module.lessons.slice(0, 3) as lesson}
								<a class="inline-card" href={`/lessons/${lesson.slug}`}>
									<div class="lesson-list__title-row">
										<strong>{lesson.title}</strong>
										<span class={`lesson-status lesson-status--${snapshot.lessons[lesson.id]?.status ?? 'unstarted'}`}>
											{snapshot.lessons[lesson.id]?.status ?? 'unstarted'}
										</span>
									</div>
									<span>{lesson.summary}</span>
								</a>
							{/each}
						</div>
					</div>

					<div class="cta-row">
						<a class="button" href={`/modules/${moduleDesignById.get(module.id)?.slug}`}>
							Open module overview
						</a>
						<a class="button button--ghost" href={`/lessons/${module.lessons[0].slug}`}>
							Jump to first lesson
						</a>
					</div>
				</section>
			{/each}
		</div>
	</section>

	<section class="surface">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Extra depth</p>
				<h2>Optional branches</h2>
			</div>
			<p class="muted">
				Useful detours when you want more texture. Skip them without breaking the main course.
			</p>
		</div>

		{#each optionalModules as module}
			<section class="module-card module-card--journey" style={moduleStyle(moduleDesignById.get(module.id)!)}>
				<header class="module-card__header">
					<div>
						<p class="eyebrow">Optional module</p>
						<h3>{module.title}</h3>
						<p class="muted">{moduleDesignById.get(module.id)?.intro}</p>
					</div>
					<span class="chip">{module.lessons.length} lessons</span>
				</header>

				<div class="module-card__journey">
					<ul class="module-question-list">
						{#each moduleDesignById.get(module.id)?.questions ?? [] as question}
							<li>{question}</li>
						{/each}
					</ul>

					<div class="bookmark-grid">
						{#each module.lessons.slice(0, 6) as lesson}
							<a class="inline-card" href={`/lessons/${lesson.slug}`}>
								<strong>{lesson.title}</strong>
								<span>{lesson.summary}</span>
							</a>
						{/each}
					</div>
				</div>

				<div class="cta-row">
					<a class="button" href={`/modules/${moduleDesignById.get(module.id)?.slug}`}>
						Open optional overview
					</a>
				</div>
			</section>
		{/each}
	</section>
</div>
