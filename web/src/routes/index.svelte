<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import Gun from 'gun/gun';

    const gun = Gun({
        peers: [
            'http://localhost:3030/gun',
        ]
    })

    const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

    const GUN_PARTICIPANTS_KEY = 'participants';

    let participantsStore: Record<string, { name: string }> = {}

    let newParticipant = '';
    let selectedParticipant = '';

    const handleSubmit = () => {
        if(!newParticipant) return;

        if(Object.values(participantsStore).find(participant => participant.name === newParticipant)){
            console.info('Participant already in!!');
            return;
        }

        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        gunParticipants.set({
            name: newParticipant,
        });

        selectedParticipant = newParticipant;
        newParticipant = '';
    }

    const resetScorer = () => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        Object.keys(participantsStore).forEach(key => {
            gunParticipants.get(key).put(null);
        });
    }

    const enterAs = (key: string) => {
        selectedParticipant = participantsStore[key].name;
    }

    onMount(() => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        gunParticipants.map().on((data, key) => {
            if(data){
                participantsStore[key] = data;
            }else if(participantsStore[key]) {
                delete participantsStore[key];
                participantsStore = participantsStore;
            }
        });
	});

    $: participants = Object.entries(participantsStore);
</script>

<svelte:head>
	<title>Task Scorer</title>
	<meta name="description" content="Peer to peer application for scoring tasks for free!!" />
</svelte:head>

<section>
    {#if selectedParticipant}
        <h1 class="text-lg text-center font-thin mb-10">
            Playing as {selectedParticipant}
        </h1>

        <div class="grid grid-cols-10 gap-2">
            {#each fibonacci as pointNumber}
                <button class="btn bg-secondary text-secondary-content" on:click={() => console.log(`${pointNumber} selected`)}>
                    {pointNumber}
                </button>
            {/each}
        </div>
    {:else}
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
                <li class="bg-primary">
                    <button on:click={() => enterAs(key)}>
                        {key} - {participant.name}
                    </button>
                </li>    
            {/each}
        </ul>
        
        <button class="btn m-2" type="button" on:click={resetScorer}>END the party</button>
    {/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
