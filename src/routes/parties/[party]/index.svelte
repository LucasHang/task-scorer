<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';

    import gun from '$lib/client';
    import { GUN_PARTIES_KEY, GUN_PARTICIPANTS_KEY } from '$lib/vars';
    import { getParty, watchParticipants, watchParty, type Listener } from '$lib/api';
    import { currentParty } from '$lib/stores/currentParty';
    import type Party from '$lib/types/party';
    import type Participant from '$lib/types/participant';

    import Participants from '$lib/participants/Participants.svelte';
    import Loading from '$lib/loading/Loading.svelte';
    import PartyHeader from '$lib/partyHeader/PartyHeader.svelte';

    let partyStore: Party | null = null;
    let participantsStore: Array<Participant> = [];
    let partyListener: Listener | null = null;
    let participantsListener: Listener | null = null;

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

    const startWatchingParticipants = (partyId: string) => {
        participantsListener = watchParticipants(partyId, participantsStore, newParticipants => {
            participantsStore = newParticipants;
        });
    }

    const leaveParty = () => {
        if($currentParty && $currentParty.participantId){
            const gunParty = gun.get(GUN_PARTIES_KEY).get($currentParty.partyId);

            const gunParticipant = gunParty.get(GUN_PARTICIPANTS_KEY).get($currentParty.participantId);
            const result = gunParticipant.put(null);

            result.once(() => {
                const newCounter = partyStore && partyStore.participantsCounter > 0 ? partyStore.participantsCounter - 1 : 0;
                gunParty.put({ participantsCounter: newCounter });

                currentParty.set(null)
            });
        }else{
            currentParty.set(null);
        }
    }

    const endParty = () => {
        // Parties set should be already being listened, so we only have
        // to kill it on gun to a `party over` behavior be triggered
        gun.get(GUN_PARTIES_KEY).get($page.params.party).put(null);
    }

    onMount(() => {
        const partyId = $page.params.party;

        getParty(partyId)
            .then(data => {
                partyStore = data;

                // If the party could be found, we start watchin for furder changes
                startWatchingParty(partyId);
                startWatchingParticipants(partyId);
            })
            .catch(() => handlePartyNotFound(partyId));
	});

    onDestroy(() => {
        partyListener?.off();
        participantsListener?.off();
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
            participants={participantsStore} 
        />
    {:else}
        <Loading />
    {/if}
</section>