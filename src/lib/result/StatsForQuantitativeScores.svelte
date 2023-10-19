<script lang="ts">
	import TrendDownIcon from '$lib/icons/TrendDownIcon.svelte';
	import GlowIcon from '$lib/icons/GlowIcon.svelte';
	import TrendUpIcon from '$lib/icons/TrendUpIcon.svelte';

	export let quantityOfParticipants: number;
	export let scores: Array<number>;

	const smallest = Math.min(...scores);

	const scoreTotal = scores.reduce((accumulator, scoreNote) => {
		return accumulator + scoreNote;
	}, 0);

	const highest = Math.max(...scores);

	const mean = Math.round(scoreTotal / quantityOfParticipants);
</script>

<div class="stats stats-vertical lg:stats-horizontal shadow">
	<div class="stat place-items-center">
		<div class="stat-title">The smallest score</div>
		<div class="stat-value">
			{smallest}
			<TrendDownIcon />
		</div>
	</div>

	<div class="stat place-items-center">
		<div class="stat-title">The final score mean</div>
		<div class="stat-value text-secondary">
			{mean}
			<GlowIcon />
		</div>
	</div>

	<div class="stat place-items-center">
		<div class="stat-title">The highest score</div>
		<div class="stat-value">
			{highest}
			<TrendUpIcon />
		</div>
	</div>
</div>
