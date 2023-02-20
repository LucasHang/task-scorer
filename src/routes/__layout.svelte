<script lang="ts">
    import { browser } from '$app/env';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { Page } from '@sveltejs/kit';

    import { currentParty } from '$lib/stores/currentParty';
    import type CurrentParty from '$lib/types/currentParty';
    import Header from '$lib/header/Header.svelte';
    import Footer from '$lib/footer/Footer.svelte';
    import '../app.css';

    const authGuard = (page: Page, party: CurrentParty | null) => {
        if(!browser){
            return;
        }

        if (page.routeId === ''){
            if ( !party?.partyId ) {
                return;
            }

            if ( party.participantId ) {
                return goto(`/parties/${party.partyId}/scoring/${party.participantId}`);
            }

            return goto(`/parties/${party.partyId}`);
        } else if ( !party?.partyId ) {
            return goto('/');
        }

        if ( page.routeId?.includes('scoring') ) {
            if ( !party?.participantId ){
                return goto(`/parties/${party.partyId}`);
            }
        }
    }

    $: authGuard($page, $currentParty);
</script>

<svelte:head>
	<title>Task Scorer</title>
	<meta name="description" content="Peer to peer application for scoring tasks for free!!" />
</svelte:head>

<Header />

<main class="flex-1 flex center">
	<slot />
</main>

<Footer />
