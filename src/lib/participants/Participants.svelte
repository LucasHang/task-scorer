<script lang="ts">
    import { goto } from '$app/navigation';

    import gun from '$lib/client';
    import { GUN_PARTIES_KEY } from '$lib/vars';
    import { currentParty } from '$lib/stores/currentParty';
    import type Participant from '$lib/types/participant';

    export let partyId: string;
    export let participants: Array<Participant>;

    let newParticipant = '';

    const handleSubmit = () => {
        if(!newParticipant) return;

        if(participants.find(p => p.name === newParticipant)){
            window.alert(`Participant "${newParticipant}" already in!!`);
            return;
        }

        const gunParticipants = gun.get(GUN_PARTIES_KEY).get(partyId).get('participants');
        gunParticipants.set({
            name: newParticipant,
            ready: false,
            selectedScore: null,
        });

        newParticipant = '';
    }

    const leaveParty = () => {
        currentParty.set(null);

        /** @todo Wont be needed when currentParty becomes an auth context */
        goto('/');
    }

    const endParty = () => {
        // Parties set should be already being listened, so we only have
        // to kill it on gun to a `party over` behavior be triggered
        gun.get(GUN_PARTIES_KEY).get(partyId).put(null);
    }
</script>


<p>If you can't find your name, fill the field and press the button to add it to the players list</p>
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

<div class="m-4 mt-10">
    <p class="text-center">Click on your name to start playing</p>

    <ul class="menu bg-base-100 text-secondary-content p-2">
        {#each participants as participant (participant.id)}
            <li class="bg-primary">
                <a href={`/scoring/${participant.id}`} class="flex justify-center">
                    {participant.id} - {participant.name}
                </a>
            </li>    
        {/each}
    </ul>
</div>

{#if $currentParty?.role === 'host'}
    <button class="btn btn-outline btn-error m-2" type="button" on:click={endParty}>
        END the party
    </button>
{:else}
    <button class="btn btn-outline btn-error m-2" type="button" on:click={leaveParty}>
        LEAVE the party
    </button>
{/if}