import gun from './client';
import type Participant from './types/participant';
import { GUN_PARTICIPANTS_KEY } from './vars';

export function watchParticipants(
	participants: Array<Participant>,
	onChange: (participants: Array<Participant>) => void
) {
	let participantsCopy = [...participants];

	gun
		.get(GUN_PARTICIPANTS_KEY)
		.map()
		.on((data, key) => {
			console.log('data', data);
			const existent = participantsCopy.find((p) => p.id === key);
			console.log('existent', existent);

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
