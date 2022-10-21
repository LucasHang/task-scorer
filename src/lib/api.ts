import gun from './client';
import type Participant from './types/participant';
import type Party from './types/party';
import { GUN_PARTICIPANTS_KEY, GUN_PARTIES_KEY } from './vars';

export interface Listener {
	off(): void;
}

export function watchParticipants(
	partyId: string,
	participants: Array<Participant>,
	onChange: (participants: Array<Participant>) => void
): Listener {
	let participantsCopy = [...participants];

	return gun
		.get(GUN_PARTIES_KEY)
		.get(partyId)
		.get(GUN_PARTICIPANTS_KEY)
		.map()
		.on((data, key) => {
			const existent = participantsCopy.find((p) => p.id === key);

			if (data) {
				if (existent) {
					participantsCopy = participantsCopy.map((p) => {
						if (p.id === key) {
							return { id: key, ...data };
						}
						return p;
					});
				} else {
					participantsCopy = [...participantsCopy, { id: key, ...data }];
				}
			} else if (existent) {
				participantsCopy = participantsCopy.filter((p) => p.id !== key);
			}

			onChange(participantsCopy);
		});
}

export function watchParty(
	partyId: string,
	onChange: (updatedParty: Party | null | undefined) => void
): Listener {
	return gun
		.get(GUN_PARTIES_KEY)
		.get(partyId)
		.on((data, key) => {
			if (data === null || data === undefined) {
				onChange(data);
				return;
			}

			onChange({
				id: key,
				name: data.name,
				participantsCounter: data.participantsCounter
			});
		});
}

export function getParty(partyId: string): Promise<Party> {
	return new Promise((resolve, reject) => {
		gun
			.get(GUN_PARTIES_KEY)
			.get(partyId)
			.once((data, key) => {
				if (data === null || data === undefined) {
					reject('Not found');
					return;
				}

				resolve({
					...data,
					id: key
				});
			});
	});
}
