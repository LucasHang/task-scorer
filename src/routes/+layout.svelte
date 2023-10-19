<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Page } from '@sveltejs/kit';

	import { currentParty } from '$lib/stores/currentParty';
	import type CurrentParty from '$lib/types/currentParty';
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';

	import '../app.css';

	const authGuard = (page: Page, party: CurrentParty | null) => {
		if (!browser) {
			return;
		}

		if (page.route.id === '' || page.route.id === '/') {
			if (!party?.partyId) {
				return;
			}

			if (party.participantId) {
				return goto(`/parties/${party.partyId}/scoring/${party.participantId}`);
			}

			return goto(`/parties/${party.partyId}`);
		} else if (!party?.partyId) {
			return goto('/');
		}

		if (page.route.id?.includes('scoring')) {
			if (!party?.participantId) {
				return goto(`/parties/${party.partyId}`);
			}
		}
	};

	$: authGuard($page, $currentParty);
</script>

<svelte:head>
	<title>Task Scorer</title>
</svelte:head>

<div class="h-full flex flex-col">
	<Header />

	<main class="flex-1 flex center">
		<slot />
	</main>

	<Footer />
</div>
