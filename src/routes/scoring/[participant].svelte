<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    import type Participant from '$lib/types/participant';

    import Scorer from '$lib/scorer/Scorer.svelte';
    import { watchParticipants, watchParticipantsCounter } from '$lib/api';

    let participantsCounterStore: number = 0;
    let participantsStore: Array<Participant> = [];

    onMount(() => {
        watchParticipantsCounter(newCounter => {
            participantsCounterStore = newCounter;
        });

        watchParticipants(participantsStore, newParticipants => {
            participantsStore = newParticipants;
        });
	});

    const checkAllReady = (participants: Array<Participant>, counter: number) => {
        if(counter === 0 || !participants.length){
            return
        }

        const ready = participants.filter(p => p.ready && p.selectedScore);

        if(ready.length === counter){
            goto('/result');
        }
    }

    $: participants = participantsStore;
    $: selectedParticipant = participants.find(p => p.id === $page.params.participant);

    $: checkAllReady(participants, participantsCounterStore);
</script>

<section>
    {#if selectedParticipant}
        <Scorer participants={participants} selectedParticipant={selectedParticipant} />
    {:else}
        <h1>Loading...</h1>
    {/if}
</section>
