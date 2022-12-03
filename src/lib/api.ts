import { v4 as uuidv4 } from 'uuid';
import { getDocs, setDoc, getDoc } from 'firebase/firestore';
import { collections } from './client';

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
