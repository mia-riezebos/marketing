<script lang="ts">
	import '../app.css';

	import favicon from '../lib/assets/favicon.svg';
	import StorageNotice from '../lib/components/StorageNotice.svelte';
	import { progressState } from '../lib/course/progress';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Course' },
		{ href: '/search', label: 'Search' },
		{ href: '/templates', label: 'Templates' },
		{ href: '/sources', label: 'Sources' },
		{ href: '/settings', label: 'Settings' }
	];

	const isActive = (href: string) =>
		href === '/' ? data.pathname === href : data.pathname.startsWith(href);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{data.courseTitle}</title>
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

<div class="app-shell">
	<header class="site-header">
		<div class="site-header__inner">
			<a class="brand" href="/">
				<span class="brand__eyebrow">Marketing course</span>
				<span class="brand__title">{data.courseTitle}</span>
			</a>

			<button
				aria-controls="site-nav"
				aria-expanded={mobileMenuOpen}
				class="menu-button"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				type="button"
			>
				<span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
			</button>

			<nav class:site-nav--open={mobileMenuOpen} class="site-nav" id="site-nav">
				<ul>
					{#each navItems as item}
						<li>
							<a
								aria-current={isActive(item.href) ? 'page' : undefined}
								class:nav-link--active={isActive(item.href)}
								class="nav-link"
								href={item.href}
								onclick={() => (mobileMenuOpen = false)}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>

	<StorageNotice warning={$progressState.warning} />

	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>
			Private progress stays in this same browser and device unless you export it yourself. No
			account, no streaks, no cross-device sync.
		</p>
	</footer>
</div>
