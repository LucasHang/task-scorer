import { writable } from 'svelte/store';
import { browser } from '$app/env';
import { LOCAL_STORAGE_PARTY_KEY } from '$lib/vars';
import type CurrentParty from '$lib/types/currentParty';

let currentPartyStorage: string | null = null;

if (browser) {
	currentPartyStorage = localStorage.getItem(LOCAL_STORAGE_PARTY_KEY);
}

export const currentParty = writable<CurrentParty | null>(
	currentPartyStorage ? JSON.parse(currentPartyStorage) : null
);

if (browser) {
	currentParty.subscribe((value) =>
		localStorage.setItem(LOCAL_STORAGE_PARTY_KEY, JSON.stringify(value))
	);
}
