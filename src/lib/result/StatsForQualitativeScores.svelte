<script lang="ts">
	import { clsx } from 'clsx';

	import GlowIcon from '$lib/icons/GlowIcon.svelte';
	import { decimalToPercentage } from '$lib/utils/numberHelper';

	export let quantityOfParticipants: number;
	console.log(
		'🚀 ~ file: StatsForQualitativeScores.svelte:7 ~ quantityOfParticipants:',
		quantityOfParticipants
	);
	export let scores: Array<string>;

	let scoreFrequencies: Record<string, number> = {};

	scores.forEach((s) => {
		if (!scoreFrequencies[s]) {
			scoreFrequencies[s] = 0;
		}

		scoreFrequencies[s]++;
	});

	const sortedScoreFrequencies = Object.entries(scoreFrequencies).sort((a, b) => b[1] - a[1]);
	console.log(
		'🚀 ~ file: StatsForQualitativeScores.svelte:14 ~ sortedScoreFrequencies:',
		sortedScoreFrequencies
	);
</script>

<div class="stats stats-vertical lg:stats-horizontal shadow">
	{#each sortedScoreFrequencies as [scoreNote, scoreFreq], index (scoreNote)}
		<div class="stat place-items-center">
			<div class="stat-title">{index + 1}º Score</div>
			<div class={clsx('stat-value', { 'text-secondary': index === 0 })}>
				{scoreNote}
				{#if index === 0}
					<GlowIcon />
				{/if}
			</div>
			<div class="stat-desc">
				{scoreFreq} ({decimalToPercentage(scoreFreq / quantityOfParticipants)}%)
			</div>
		</div>
	{/each}
</div>
