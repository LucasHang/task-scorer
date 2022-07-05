<script lang="ts">
    import type { IGunInstance } from "gun/types";
    import type Participant from "$lib/types/participant";
    import { GUN_PARTICIPANTS_KEY } from "$lib/vars";
    import { selectedParticipant } from '$lib/stores';

    export let gun: IGunInstance<any>;
    export let participants: Array<[string, Participant]>;

    const reset = () => {
        selectedParticipant.update(participant => ({ ...participant, ready: false, selectedScore: null }));

        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        participants.forEach(([key]) => {
            gunParticipants.get(key).put({ ready: false, selectedScore: null });
        });
    }

    const scoreTotal = participants.reduce((accumulator, [, participant]) => {
        return accumulator + (participant.selectedScore || 0);
    }, 0);
</script>

<div class="stats shadow">
    <div class="stat place-items-center">
      <div class="stat-title">The final score mean</div>
      <div class="stat-value">{Math.round(scoreTotal / participants.length)}</div>
    </div>
</div>

<ul class="menu p-2 m-4">
    {#each participants as [key, participant] (key)}
        <li class="bg-ghost">
            <div class="flex flex-row items-center gap-2">
                {key} - {participant.name}

                <div class="avatar placeholder">
                    <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span class="text-xs">{participant.selectedScore}</span>
                    </div>
                </div>
            </div>
        </li>    
    {/each}
</ul>

<button class="btn m-2" type="button" on:click={reset}>Play again</button>