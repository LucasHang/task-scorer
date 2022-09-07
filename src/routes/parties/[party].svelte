<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    import { getParty, watchParty } from '$lib/api';
    import { currentParty } from '$lib/stores/currentParty';
    import type Party from '$lib/types/party';

    import Participants from '$lib/participants/Participants.svelte';
    import Loading from '$lib/loading/Loading.svelte';

    let partyStore: Party | null = null;

    const handlePartyNotFound = (partyId: string) => {
        window.alert(`Party "${partyId}" not found!`)
                        
        currentParty.set(null);

        /** @todo Wont be needed when currentParty becomes an auth context */
        goto('/');
    }

    onMount(() => {
        const partyId = $page.params.party;

        getParty(partyId)
            .then(data => {
                partyStore = data;

                // If the party could be found, we start watchin for furder changes
                watchParty(partyId, updatedParty => {
                    if(!updatedParty){
                        handlePartyNotFound(partyId)
                    }else{
                        partyStore = updatedParty;
                    }
                });
            })
            .catch(() => handlePartyNotFound(partyId));
	});

    $: participants = partyStore?.participants || [];
</script>

<section>
    {#if Boolean(partyStore)}
        <Participants 
            participants={participants} 
        />
    {:else}
        <Loading />
    {/if}
</section>