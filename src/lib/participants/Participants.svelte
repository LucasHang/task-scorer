<script lang="ts">
    import type { IGunInstance } from 'gun/types';
    import type Participant from '$lib/types/participant';
    import { GUN_PARTICIPANTS_KEY } from '$lib/vars';
    import { selectedParticipant } from '$lib/stores';

    export let gun: IGunInstance<any>;
    export let participants: Array<[string, Participant]>;
    export let participantsStore: Record<string, Participant>;

    let newParticipant = '';

    const handleSubmit = () => {
        if(!newParticipant) return;

        if(Object.values(participantsStore).find(participant => participant.name === newParticipant)){
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
        Object.keys(participantsStore).forEach(key => {
            gunParticipants.get(key).put(null);
        });
    }

    const enterAs = (key: string) => {
        const participant = participantsStore[key];

        selectedParticipant.set({
            key,
            name: participant.name,
            ready: participant.ready,
            selectedScore: participant.selectedScore,
        });
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input
        type="text"
        name="participant_name"
        placeholder="Tell me your name"
        class="input"
        bind:value={newParticipant}
    />
    <button class="btn" type="submit">Join the party</button>
</form>

<ul class="menu bg-base-100 text-secondary-content p-2 m-4">
    {#each participants as [key, participant] (key)}
        <li class="flex flex-row items-center gap-2 bg-primary">
            <button on:click={() => enterAs(key)}>
                {key} - {participant.name}
            </button>
        </li>    
    {/each}
</ul>

<button class="btn m-2" type="button" on:click={resetScorer}>END the party</button>