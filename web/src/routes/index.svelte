<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import Gun from 'gun/gun';
    
    import type Participant from 'src/types/participant';
    import { GUN_PARTICIPANTS_KEY, GUN_PEERS } from 'src/vars';

    import Participants from '$lib/participants/Participants.svelte';
    import Scorer from '$lib/scorer/Scorer.svelte';

    const gun = Gun({ peers: GUN_PEERS });

    let participantsStore: Record<string, Participant> = {}
    let selectedParticipant = '';

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
</script>

<svelte:head>
	<title>Task Scorer</title>
	<meta name="description" content="Peer to peer application for scoring tasks for free!!" />
</svelte:head>

<section>
    {#if selectedParticipant}
        <Scorer selectedParticipant={selectedParticipant} />
    {:else}
        <Participants 
            gun={gun} 
            participants={participants} 
            participantsStore={participantsStore} 
            selectedParticipant={selectedParticipant} 
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
