<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
	import type { Unsubscribe } from 'firebase/firestore';

    import { deleteParticipant, deleteParty, getParty, watchParty } from '$lib/api';
    import { currentParty } from '$lib/stores/currentParty';
    import type Party from '$lib/types/party';

    import Participants from '$lib/participants/Participants.svelte';
    import Loading from '$lib/loading/Loading.svelte';
    import PartyHeader from '$lib/partyHeader/PartyHeader.svelte';

    let partyStore: Party | null = null;
    let partyListener: Unsubscribe | null = null;

    /** @todo abstrair processo em hook */
    const handlePartyNotFound = (partyId: string) => {
        console.log(`[Parties]: Party "${partyId}" is over!`)
                        
        currentParty.set(null);
    }

    const startWatchingParty = (partyId: string) => {
        partyListener = watchParty(partyId, updatedParty => {
            if(!updatedParty){
                handlePartyNotFound(partyId)
            }else{
                partyStore = updatedParty;
            }
        });
    }

    const leaveParty = async () => {
        if($currentParty && $currentParty.participantId){
            const participantToDeleteId = $currentParty.participantId;
            const participantToDelete = partyStore?.participants.find(p => p.id === participantToDeleteId);

            if(participantToDelete){
                await deleteParticipant($currentParty.partyId, participantToDelete);
            }

            currentParty.set(null)
        }else{
            currentParty.set(null);
        }
    }

    const endParty = async () => {
        // Parties set should be already being listened, so we only have
        // to kill it to a `party over` behavior be triggered
        await deleteParty($page.params.party);
    }

    onMount(() => {
        const partyId = $page.params.party;

        getParty(partyId)
            .then(data => {
                if(!data){
                    handlePartyNotFound(partyId);
                    return;
                }

                partyStore = data;

                // If the party could be found, we start watchin for furder changes
                startWatchingParty(partyId);
            })
            .catch(() => handlePartyNotFound(partyId));
	});

    onDestroy(() => {
        if(partyListener){
            partyListener();
        }
    })
</script>

<section>
    {#if !!partyStore}
        <PartyHeader 
            party={partyStore} 
            role={$currentParty?.role || 'guest'} 
            onLeave={leaveParty} 
            onEnd={endParty} 
        />
                    
        <Participants 
            party={partyStore}
        />
    {:else}
        <Loading />
    {/if}
</section>