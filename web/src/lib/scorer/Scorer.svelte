<script lang="ts">
    export let selectedParticipant: string;

    const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
</script>

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