<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { page } from '$app/stores';
	import type { Unsubscribe } from 'firebase/firestore';
    
    import type Participant from '$lib/types/participant';
	import type Party from '$lib/types/party';

    import { getParty, watchParty } from '$lib/api';
	import { currentParty } from '$lib/stores/currentParty';
    import Result from '$lib/result/Result.svelte';
	import Loading from '$lib/loading/Loading.svelte';

    let partyStore: Party | null = null;
    let partyListener: Unsubscribe | null = null;

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

    const checkAllReady = (participants?: Array<Participant>) => {
        if(!participants || !participants.length){
            return
        }

        const ready = participants.filter(p => p.ready && p.selectedScore);

        return ready.length == participants.length;
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

    $: allParticipantsReady = checkAllReady(partyStore?.participants);
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
                participants={partyStore.participants} 
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
</section>
