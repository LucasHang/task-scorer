<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    import Participants from '$lib/participants/Participants.svelte';
    import { watchParty } from '$lib/api';
    import type Party from '$lib/types/party';
    import { currentParty } from '$lib/stores/currentParty';

    let partyStore: Party | null = null;

    onMount(() => {
        watchParty($page.params.party, updatedParty => {
            if(!updatedParty){
                console.error('Party not found!');
                currentParty.set(null);

                /** @todo Wont be needed when currentParty becomes an auth context */
                goto('/');
            }else{
                partyStore = updatedParty;
            }
        });
	});

    $: participants = partyStore?.participants || [];
</script>

<section>
    <Participants 
        participants={participants} 
    />
</section>