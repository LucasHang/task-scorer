<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import Gun from 'gun/gun';
    
    import type Participant from '$lib/types/participant';
    import { GUN_PARTICIPANTS_KEY, GUN_PEERS } from '$lib/vars';

    import Participants from '$lib/participants/Participants.svelte';
    import Scorer from '$lib/scorer/Scorer.svelte';
    import Result from '$lib/result/Result.svelte';
    import { selectedParticipant } from '$lib/stores';

    const gun = Gun({ peers: GUN_PEERS });

    let participantsStore: Record<string, Participant> = {}

    onMount(() => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        gunParticipants.map().on((data, key) => {
            if(data){
                participantsStore[key] = data;
            }else if(participantsStore[key]) {
                delete participantsStore[key];
                participantsStore = participantsStore;
            }
        });
	});

    $: participants = Object.entries(participantsStore);
    $: allParticipantsReady = 
        Object.keys(participantsStore).length > 0 && 
        !Object.values(participantsStore).find(item => !item.ready || !item.selectedScore);
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
            participantsStore={participantsStore} 
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
