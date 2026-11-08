<script lang="ts">
	import { lessonVisualKinds } from '../course/learning-design';
	import { visualExplainers } from '../course/visual-explainers';

	type Props = {
		lessonId: string;
	};

	type Step = {
		id: string;
		label: string;
		title: string;
		detail: string;
		note: string;
	};

	let { lessonId }: Props = $props();
	const kind = $derived(lessonVisualKinds[lessonId]);
	let activeIndex = $state(0);
	const explainer = $derived(kind ? visualExplainers[kind] : null);
</script>

{#if explainer}
	<section aria-labelledby="visual-explainer-heading" class="visual-explainer surface">
		<div class="visual-explainer__intro">
			<p class="eyebrow">Visual explainer</p>
			<h2 id="visual-explainer-heading">{explainer.heading}</h2>
			<p class="muted">{explainer.intro}</p>
		</div>

		<div class="step-picker" role="list" aria-label="Lesson concept breakdown">
			{#each explainer.items as step, index}
				<button
					aria-pressed={activeIndex === index}
					class:step-picker__button--active={activeIndex === index}
					class="step-picker__button"
					onclick={() => (activeIndex = index)}
					type="button"
				>
					<span class="step-picker__number">{step.label}</span>
					<span>{step.title}</span>
				</button>
			{/each}
		</div>

		<div class="four-step-model">
			<ol class="four-step-model__rail" aria-label="Four-step marketing model">
				{#each explainer.items as step, index}
					<li class:four-step-model__step--active={activeIndex === index} class="four-step-model__step">
						<span class="four-step-model__badge">{step.label}</span>
						<div>
							<h3>{step.title}</h3>
							<p>{step.detail}</p>
						</div>
					</li>
				{/each}
			</ol>

			<div class="four-step-model__focus" aria-live="polite">
				<p class="eyebrow">{explainer.noticeLabel}</p>
				<h3>{explainer.items[activeIndex].title}</h3>
				<p>{explainer.items[activeIndex].detail}</p>
				<p class="muted">{explainer.items[activeIndex].note}</p>
			</div>
		</div>
	</section>
{/if}
