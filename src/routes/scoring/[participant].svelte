<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    import { watchParticipants, watchParticipantsCounter } from '$lib/api';
    import type Participant from '$lib/types/participant';

    import Scorer from '$lib/scorer/Scorer.svelte';
    import Loading from '$lib/loading/Loading.svelte';

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
        <Loading />
    {/if}
</section>
