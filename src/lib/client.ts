import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, QueryDocumentSnapshot } from 'firebase/firestore';
import type Party from './types/party';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const converter = <T>() => ({
	toFirestore: (data: T) => data,
	fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T
});

const collections = {
	parties: collection(db, 'parties').withConverter(converter<Party>()),
	party: (id: string) => doc(db, 'parties', id).withConverter(converter<Party>())
};

export default app;
export { db, collections };
