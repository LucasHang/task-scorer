<script lang="ts">
    import { onMount } from 'svelte';
    
    import type Participant from '$lib/types/participant';

    import Result from '$lib/result/Result.svelte';
    import { watchParticipants } from '$lib/api';

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
</script>

<section>
    {#if allParticipantsReady}
        <Result participants={participants} />
    {:else}
        <h1>Not all participants are ready, <button on:click={() => history.back()}>Go Back</button></h1>
    {/if}
</section>
