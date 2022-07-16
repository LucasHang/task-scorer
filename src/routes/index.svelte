<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import Gun from 'gun/gun.js';
    
    import type Participant from '$lib/types/participant';
    import { GUN_PEERS } from '$lib/vars';

    import Participants from '$lib/participants/Participants.svelte';
    import Scorer from '$lib/scorer/Scorer.svelte';
    import Result from '$lib/result/Result.svelte';
    import { selectedParticipant } from '$lib/stores';
    import { watchParticipants } from '$lib/client';

    const gun = Gun({ peers: GUN_PEERS });

    let participantsStore: Array<Participant> = [];

    onMount(() => {
        watchParticipants(participantsStore, newParticipants => {
            participantsStore = newParticipants;
        });
	});

    $: participants = participantsStore;
    $: allParticipantsReady = 
        participants.length > 0 && 
        !participants.find(item => !item.ready || !item.selectedScore);

    $: console.log('index.svelte ~ participants', participants);
</script>

<svelte:head>
	<title>Task Scorer</title>
	<meta name="description" content="Peer to peer application for scoring tasks for free!!" />
</svelte:head>

<section>
    {#if allParticipantsReady}
        <Result gun={gun} participants={participants} />
    {:else if $selectedParticipant}
        <Scorer gun={gun} participants={participants} />
    {:else}
        <Participants 
            gun={gun} 
            participants={participants} 
        />
    {/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
