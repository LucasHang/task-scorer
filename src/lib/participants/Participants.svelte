<script lang="ts">
    import type Participant from '$lib/types/participant';
    import { GUN_PARTICIPANTS_COUNTER_KEY, GUN_PARTICIPANTS_KEY } from '$lib/vars';
    import gun from '$lib/client';

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

        gun.get(GUN_PARTICIPANTS_COUNTER_KEY).put({ counter: participants.length + 1 });

        newParticipant = '';
    }

    const resetScorer = () => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        participants.forEach(p => {
            gunParticipants.get(p.id).put(null);
        });

        gun.get(GUN_PARTICIPANTS_COUNTER_KEY).put({ counter: 0 });
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
                <a href={`/scoring/${participant.id}`}>
                    {participant.id} - {participant.name}
                </a>
            </li>    
        {/each}
    </ul>
</div>

<button class="btn m-2" type="button" on:click={resetScorer}>END the party</button>