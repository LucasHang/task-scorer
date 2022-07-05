import { writable } from 'svelte/store';
import type { ParticipantWithKey } from './types/participant';

export const selectedParticipant = writable<ParticipantWithKey>();
