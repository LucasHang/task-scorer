import { v4 as uuidv4 } from 'uuid';
import {
	getDocs,
	setDoc,
	getDoc,
	deleteDoc,
	onSnapshot,
	updateDoc,
	arrayRemove,
	arrayUnion
} from 'firebase/firestore';
import { collections } from './client';
import type Party from './types/party';
import type Participant from './types/participant';

export async function getParties() {
	const querySnapshot = await getDocs(collections.parties);
	return querySnapshot.docs.map((doc) => doc.data());
}

export async function createParty(name: string) {
	try {
		const newParty = {
			id: uuidv4(),
			name,
			participants: []
		};

		await setDoc(collections.party(newParty.id), newParty);

		console.info('Party created with id:', newParty.id);

		return newParty;
	} catch (error) {
		console.error('Error creating party:', error);
	}
}

export async function getParty(id: string) {
	const querySnapshot = await getDoc(collections.party(id));
	return querySnapshot.data();
}

export async function deleteParty(id: string) {
	try {
		await deleteDoc(collections.party(id));

		console.info('Party deleted with success:', id);
	} catch (error) {
		console.error('Error deleting party:', error);
	}
}

export function watchParty(id: string, onChange: (data: Party | undefined) => void) {
	const unsubscribe = onSnapshot(collections.party(id), (doc) => {
		onChange(doc.data());
	});

	return unsubscribe;
}

export async function deleteParticipant(partyId: string, participant: Participant) {
	try {
		await updateDoc(collections.party(partyId), {
			participants: arrayRemove(participant)
		});

		console.info('Participant deleted with success:', participant);
	} catch (error) {
		console.error('Error deleting participant:', error);
	}
}

export async function createParticipant(partyId: string, participantName: string) {
	try {
		const newParticipant: Participant = {
			id: uuidv4(),
			name: participantName,
			ready: false,
			selectedScore: null
		};

		await updateDoc(collections.party(partyId), {
			participants: arrayUnion(newParticipant)
		});

		console.info('Participant created with id:', newParticipant.id);

		return newParticipant;
	} catch (error) {
		console.error('Error creating participant:', error);
	}
}

type ParticipantToUpdate = Partial<Participant> & { id: string };

export async function updateParticipant(
	partyId: string,
	currentParticipants: Array<Participant>,
	newParticipant: ParticipantToUpdate
) {
	try {
		const newParticipants = currentParticipants.map((participant) => {
			if (participant.id !== newParticipant.id) {
				return participant;
			}

			return { ...participant, ...newParticipant };
		});

		await updateDoc(collections.party(partyId), {
			participants: newParticipants
		});

		console.info('Participant updated with success:', newParticipant);
	} catch (error) {
		console.error('Error updating participant:', error);
	}
}
