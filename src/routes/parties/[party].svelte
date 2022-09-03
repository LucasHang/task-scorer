<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    import type Participant from '$lib/types/participant';

    import Participants from '$lib/participants/Participants.svelte';
    import { watchParticipants } from '$lib/api';

    let participantsStore: Array<Participant> = [];

    onMount(() => {
        watchParticipants(participantsStore, newParticipants => {
            participantsStore = newParticipants;
        });
	});

    console.log('$page.params.party', $page.params.party);

    $: participants = participantsStore;
</script>

<section>
    <Participants 
        participants={participants} 
    />
</section>