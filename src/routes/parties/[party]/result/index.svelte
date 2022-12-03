<!-- <script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { page } from '$app/stores';
    
    import type Participant from '$lib/types/participant';
	import type Party from '$lib/types/party';

    import { getParty, watchParty, watchParticipants, type Listener } from '$lib/api';
	import { currentParty } from '$lib/stores/currentParty';
    import Result from '$lib/result/Result.svelte';
	import Loading from '$lib/loading/Loading.svelte';

    let partyStore: Party | null = null;
    let participantsStore: Array<Participant> = [];
    let partyListener: Listener | null = null;
    let participantsListener: Listener | null = null;

    const handlePartyNotFound = (partyId: string) => {
        console.log(`[Result]: Party "${partyId}" is over!`)
                        
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

    const checkAllReady = (participants: Array<Participant>, counter: number) => {
        if(counter === 0 || !participants.length){
            return
        }

        const ready = participants.filter(p => p.ready && p.selectedScore);

        return ready.length == counter;
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
    });

    $: allParticipantsReady = checkAllReady(participantsStore, partyStore?.participantsCounter || 0);
    $: goBackUrl = $currentParty?.participantId ? 
        `/parties/${$page.params.party}/scoring/${$currentParty.participantId}` : 
        `/parties/${$page.params.party}`;
</script>

<section>
    {#if !!partyStore}
        <div class="flex flex-col items-center mb-20 mt-4">
            <h1 class="text-3xl font-bold inline-flex items-center">
                Scoring Results
            </h1>
        </div>

        {#if allParticipantsReady}
            <Result 
                partyId={$page.params.party} 
                participants={participantsStore} 
                role={$currentParty?.role || 'guest'} 
                goBackUrl={goBackUrl} 
            />
        {:else}
            <h1>
                Not all participants are ready, <a href={goBackUrl} class="link">Go back to Scoring</a>
            </h1>
        {/if}
    {:else}
        <Loading />
    {/if}
</section> -->
