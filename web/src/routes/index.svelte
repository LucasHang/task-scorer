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

    const GUN_PARTICIPANTS_KEY = 'participants';

    let participantsStore: Record<string, { name: string }> = {}

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
        });

        newParticipant = '';
    }

    const resetScorer = () => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        Object.keys(participantsStore).forEach(key => {
            gunParticipants.get(key).put(null);
        });
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
	<h1>
		<span class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <input
            type="text"
            name="participant_name"
            placeholder="Tell me your name"
            bind:value={newParticipant}
        />
        <button type="submit">Join the party</button>
    </form>

    <button type="button" on:click={resetScorer}>END the party</button>

    {#each participants as [key, participant] (key)}
        <h2>{key} - {participant.name}</h2>
    {/each}
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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
