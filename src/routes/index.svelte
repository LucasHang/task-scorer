<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    
    import gun from "$lib/client";
    import { currentParty } from "$lib/stores/currentParty";
    import { GUN_PARTIES_KEY } from "$lib/vars";

    let partyKey = '';
    let partyKeyPlaceholder = 'Party key goes here';

    let newPartyName = '';
    let newPartyNamePlaceholder = 'Party name goes here';

    onMount(() => {
        gun.get(GUN_PARTIES_KEY).map().on((data, key) => {
			console.log('gunParties', data, key);
		});
    });

    const joinParty = () => {
        if( !partyKey ) {
            partyKeyPlaceholder += ' !';
            return;
        }

        currentParty.set({ partyId: partyKey, role: 'guest' });
    }

    const createParty = () => {
        if( !newPartyName ) {
            newPartyNamePlaceholder += ' !';
            return;
        }

        const result = gun.get(GUN_PARTIES_KEY).set({
            name: newPartyName,
        });

        result.once((_, key) => {
            currentParty.set({ partyId: key, role: 'host' });
        });
    }

    /** @todo Probably should be a auth context around all pages */
    $: if($currentParty?.partyId){
        goto(`/parties/${$currentParty.partyId}`);
    }
</script>

<section>
    <div class="flex flex-col justify-center items-center w-full lg:flex-row">
        <div class="card w-96 bg-base-100 shadow-xl image-full">
            <figure><img src="meteor.svg" alt="Join a Party" /></figure>

            <div class="card-body">
                <h2 class="card-title">Join a Party!</h2>

                <p>If you have a <b>Party Key</b>, come this way.</p>

                <div class="card-actions justify-end">
                    <input 
                        type="text" 
                        placeholder={partyKeyPlaceholder} 
                        class="input input-ghost flex-1" 
                        bind:value={partyKey} 
                    />

                    <button class="btn btn-primary" on:click={joinParty}>Join</button>
                </div>
            </div>
        </div>

        <div class="divider my-8 lg:divider-horizontal lg:mx-8">OR</div> 

        <div class="card w-96 bg-base-100 shadow-xl image-full">
            <figure><img src="colored-shapes.svg" alt="Throw a Party" /></figure>

            <div class="card-body">
                <h2 class="card-title">Throw a Party!</h2>

                <p>Want to be the boss?? I'll show you how.</p>

                <div class="card-actions justify-end">
                    <input 
                        type="text" 
                        placeholder={newPartyNamePlaceholder} 
                        class="input input-ghost flex-1" 
                        bind:value={newPartyName} 
                    />

                    <button class="btn btn-primary" on:click={createParty}>Throw</button>
                </div>
            </div>
        </div>
    </div>
</section>
