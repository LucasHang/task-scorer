<script lang="ts">
    import type Participant from "$lib/types/participant";
    import { GUN_PARTICIPANTS_KEY } from "$lib/vars";
    import gun from "$lib/client";

    export let participants: Array<Participant>;

    const reset = () => {
        const gunParticipants = gun.get(GUN_PARTICIPANTS_KEY);
        participants.forEach(p => {
            gunParticipants.get(p.id).put({ ready: false, selectedScore: null });
        });

        history.back();
    }

    const smallest = Math.min(...participants.map(p => p.selectedScore || 0));
    
    const scoreTotal = participants.reduce((accumulator, participant) => {
        return accumulator + (participant.selectedScore || 0);
    }, 0);

    const highest = Math.max(...participants.map(p => p.selectedScore || 0));
</script>

<div class="stats shadow">
    <div class="stat place-items-center">
      <div class="stat-title">The smallest score vv</div>
      <div class="stat-value">{smallest}</div>
    </div>
    <div class="stat place-items-center">
      <div class="stat-title">The final score mean ==</div>
      <div class="stat-value">{Math.round(scoreTotal / participants.length)}</div>
    </div>
    <div class="stat place-items-center">
      <div class="stat-title">The highest score ^^</div>
      <div class="stat-value">{highest}</div>
    </div>
</div>

<ul class="menu p-2 m-4">
    {#each participants as participant (participant.id)}
        <li class="bg-ghost">
            <div class="flex flex-row items-center gap-2">
                {participant.id} - {participant.name}

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