import { writable } from 'svelte/store';
import type Participant from '../types/participant';

export const selectedParticipant = writable<Participant>();
