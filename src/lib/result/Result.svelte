<script lang="ts">
	import { goto } from "$app/navigation";
    
    import type Participant from "$lib/types/participant";
	import type CurrentParty from "$lib/types/currentParty";

	import { updateParticipants } from "$lib/api";

    export let partyId: string;
    export let participants: Array<Participant>;
    export let role: CurrentParty['role'];
    export let goBackUrl: string;

    const reset = async () => {
        const newParticipants = participants.map(participant => {
            return { ...participant, ready: false, selectedScore: null }
        });

        await updateParticipants(partyId, newParticipants);

        goto(goBackUrl);
    }

    const smallest = Math.min(...participants.map(p => p.selectedScore || 0));
    
    const scoreTotal = participants.reduce((accumulator, participant) => {
        return accumulator + (participant.selectedScore || 0);
    }, 0);

    const highest = Math.max(...participants.map(p => p.selectedScore || 0));
</script>

<div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat place-items-center">
        <div class="stat-title">The smallest score</div>
        <div class="stat-value">
            {smallest} <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
        </div>
    </div>

    <div class="stat place-items-center">
        <div class="stat-title">The final score mean</div>
        <div class="stat-value text-secondary">
            {Math.round(scoreTotal / participants.length)} <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        </div>
    </div>

    <div class="stat place-items-center">
        <div class="stat-title">The highest score</div>
        <div class="stat-value">
            {highest} <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        </div>
    </div>
</div>

<ul class="menu p-2 m-4">
    {#each participants as participant (participant.id)}
        <li class="bg-ghost">
            <div class="flex flex-row justify-center items-center gap-2">
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

{#if (role === 'host')}
    <button class="btn btn-error m-2" type="button" on:click={reset}>Play again</button>
{/if}