<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { IGunInstance } from 'gun/types';
    import type Participant from "$lib/types/participant";
    import { GUN_PARTICIPANTS_KEY } from '$lib/vars';
    import { selectedParticipant } from '$lib/stores';

    export let gun: IGunInstance<any>;
    export let participants: Array<Participant>;
    
    const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

    const updateParticipant = (value: Partial<Participant>) => {
        gun.get(GUN_PARTICIPANTS_KEY).get($selectedParticipant.id).put({ ...value });
    }

    const handleSelectScore = (value: number) => {
        if($selectedParticipant.ready){
            selectedParticipant.update(participant => ({ ...participant, ready: false }));
        }

        let newSelectedScore: number | null = value;
        if(value === $selectedParticipant.selectedScore){
            newSelectedScore = null;
        }

        selectedParticipant.update(participant => ({ ...participant, selectedScore: newSelectedScore }));
    }

    const unsubscribe = selectedParticipant.subscribe(value => {
		updateParticipant({ ready: value?.ready, selectedScore: value?.selectedScore });
	});

    onMount(() => {
        if($selectedParticipant.selectedScore){
            selectedParticipant.update(participant => ({ ...participant, selectedScore: null }));
        }else{
            if($selectedParticipant.ready && !$selectedParticipant.selectedScore){
                selectedParticipant.update(participant => ({ ...participant, ready: false }));
            }
        }
    });
    onDestroy(() => unsubscribe());
</script>

<p>Here you can choose the score and check the "ready" switch when you feel safe</p>
<p>When all players are ready the result will be shown</p>
<br>

<h1 class="text-lg text-center font-thin mb-10">
    Playing as {$selectedParticipant.id} - {$selectedParticipant.name}
</h1>

<div class="grid grid-cols-10 gap-2">
    {#each fibonacci as pointNumber}
        <button 
            class={`btn bg-secondary text-secondary-content${pointNumber === $selectedParticipant.selectedScore ? ' bg-success' : ''}`} 
            on:click={() => handleSelectScore(pointNumber)}>
            {pointNumber}
        </button>
    {/each}
</div>

<div class="form-control w-48 m-4">
    <label class="cursor-pointer label">
        <span class="label-text">I'm f#ck!ng ready!!</span>
        <input 
            type="checkbox" 
            bind:checked={$selectedParticipant.ready} 
            disabled={!$selectedParticipant.selectedScore}
            class="toggle toggle-accent" />
    </label>
</div>

<ul class="menu p-2 m-4">
    {#each participants as participant (participant.id)}
        <li class="bg-ghost">
            <div class="flex flex-row items-center gap-2">
                {participant.id} - {participant.name}

                {#if participant.ready} 
                    <div class="badge badge-accent">ready</div> 
                {:else} 
                    <div class="badge">matutating...</div>
                {/if}
            </div>
        </li>    
    {/each}
</ul>