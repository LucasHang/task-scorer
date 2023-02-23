import { onMount, onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import type Party from "$lib/types/party";
import type { Unsubscribe } from "firebase/firestore";

import { getParty, watchParty } from '$lib/api';
import { currentParty } from '$lib/stores/currentParty';

/** Used for getting and watching the party */
export default function useParty(partyId: string): Writable<Party | null> {
    const partyStore = writable<Party | null>(null);

    let partyListener: Unsubscribe | null = null;

    const handlePartyNotFound = () => {
		console.log(`[Parties]: Party "${partyId}" is over!`);

		currentParty.set(null);
	};

	const startWatchingParty = () => {
		partyListener = watchParty(partyId, (updatedParty) => {
			if (!updatedParty) {
				handlePartyNotFound();
			} else {
				partyStore.set(updatedParty);
			}
		});
	};

    onMount(() => {
		getParty(partyId)
			.then((data) => {
				if (!data) {
					handlePartyNotFound();
					return;
				}

				partyStore.set(data);

				// If the party could be found, we start watching for further changes
				startWatchingParty();
			})
			.catch(() => handlePartyNotFound());
	});

	onDestroy(() => {
		if (partyListener) {
			partyListener();
		}
	});

    return partyStore;
}