<script lang="ts">
	type Props = {
		warning: string | null;
	};

	let { warning }: Props = $props();
</script>

{#if warning}
	<div aria-live="polite" class="storage-notice">
		<strong>Local progress note.</strong>
		<span>{warning}</span>
	</div>
{/if}
