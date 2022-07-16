<script lang="ts">
    import type { IGunInstance } from 'gun/types';
    import type Participant from '$lib/types/participant';
    import { GUN_PARTICIPANTS_KEY } from '$lib/vars';
    import { selectedParticipant } from '$lib/stores';

    export let gun: IGunInstance<any>;
    export let participants: Array<Participant>;

    let newParticipant = '';

    const handleSubmit = () => {
        if(!newParticipant) return;

        if(participants.find(p => p.name === newParticipant)){
            console.info('Participant already in!!');
            return;
        }

        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        gunParticipants.set({
            name: newParticipant,
            ready: false,
            selectedScore: null,
        });

        newParticipant = '';
    }

    const resetScorer = () => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        participants.forEach(p => {
            gunParticipants.get(p.id).put(null);
        });
    }

    const enterAs = (key: string) => {
        const participant = participants.find(p => p.id === key);
        if(participant){
            selectedParticipant.set(participant);
        }
    }
</script>


<p>If you can't find your name, fill the field and press the button to add it to the players list</p>
<br>
<form on:submit|preventDefault={handleSubmit}>
    <input
        type="text"
        name="participant_name"
        placeholder="Tell me your name"
        class="input input-bordered"
        bind:value={newParticipant}
    />
    <button class="btn" type="submit">Join the party</button>
</form>

<div class="m-4 mt-10">
    <p class="text-center">Click on your name to start playing</p>

    <ul class="menu bg-base-100 text-secondary-content p-2">
        {#each participants as participant (participant.id)}
            <li class="flex flex-row items-center gap-2 bg-primary">
                <button on:click={() => enterAs(participant.id)}>
                    {participant.id} - {participant.name}
                </button>
            </li>    
        {/each}
    </ul>
</div>

<button class="btn m-2" type="button" on:click={resetScorer}>END the party</button>