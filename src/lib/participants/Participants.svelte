<script lang="ts">
    import gun from '$lib/client';
    import { GUN_PARTIES_KEY, GUN_PARTICIPANTS_KEY } from '$lib/vars';
	import { currentParty } from '$lib/stores/currentParty';
    import type Participant from '$lib/types/participant';
	import type Party from '$lib/types/party';

    export let party: Party;
    export let participants: Array<Participant>;

    let newParticipant = '';

    const handleSubmit = () => {
        if(!newParticipant) return;

        if(participants.find(p => p.name === newParticipant)){
            window.alert(`Participant "${newParticipant}" already in!!`);
            return;
        }

        const gunParty = gun.get(GUN_PARTIES_KEY).get(party.id);

        const gunParticipants = gunParty.get(GUN_PARTICIPANTS_KEY);
        const result = gunParticipants.set({
            name: newParticipant,
            ready: false,
            selectedScore: null,
        });

        result.once((data, key) => {
            console.log('party', party);
            gunParty.put({ participantsCounter: party.participantsCounter + 1 });

            currentParty.update(state => state && ({ ...state, participantId: key}));
        });

        newParticipant = '';
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
                <a href={`/parties/${party.id}/scoring/${participant.id}`} class="flex justify-center">
                    {participant.id} - {participant.name}
                </a>
            </li>    
        {/each}
    </ul>
</div>