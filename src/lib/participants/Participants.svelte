<script lang="ts">
	import { goto } from '$app/navigation';

    import { currentParty } from '$lib/stores/currentParty';
	import { createParticipant } from '$lib/api';
	import type Party from '$lib/types/party';

    export let party: Party;

    let newParticipant = '';

    const handleSubmit = async () => {
        if(!newParticipant) return;

        if(party.participants.find(p => p.name === newParticipant)){
            window.alert(`Participant "${newParticipant}" already in!!`);
            return;
        }

        const createdParticipant = await createParticipant(party.id, newParticipant);

        if(createdParticipant){
            joinAs(createdParticipant.id);
            newParticipant = '';
        }
    }

    const joinAs = (participantId: string) => {
        currentParty.update(state => state && ({ ...state, participantId }));
        
        goto(`/parties/${party.id}/scoring/${participantId}`);
    }
</script>

{#if $currentParty?.participantId}
    <a href={`/parties/${party.id}/scoring/${$currentParty.participantId}`} class="btn btn-success" type="submit">
        Go back to Scoring
    </a>
{:else}
    <p>Fill the field and press the button to start playing</p>
    <br>
    <form on:submit|preventDefault={handleSubmit}>
        <input
            type="text"
            name="participant_name"
            placeholder="Tell me your nickname"
            class="input input-bordered"
            bind:value={newParticipant}
        />
        <button class="btn" type="submit">Join the party</button>
    </form>
{/if}

<div class="m-4 mt-10">
    <p class="text-center">These are the party players</p>

    <ul class="menu bg-base-100 text-secondary-content p-2">
        {#each party.participants as participant (participant.id)}
            <li class="bg-primary">
                <div class="flex justify-center">
                    {participant.id} - {participant.name}
                </div>
            </li>    
        {/each}
    </ul>
</div>