import Gun from 'gun/gun.js';
import type Participant from './types/participant';
import { GUN_PARTICIPANTS_KEY, GUN_PEERS } from './vars';

const gun = Gun({ peers: GUN_PEERS });

export function watchParticipants(
	participants: Array<Participant>,
	onChange: (participants: Array<Participant>) => void
) {
	gun
		.get(GUN_PARTICIPANTS_KEY)
		.map()
		.on((data, key) => {
			console.log('data', data);
			const existent = participants.find((p) => p.id === key);
			console.log('existent', existent);

			if (data) {
				if (existent) {
					participants = participants.map((p) => {
						if (p.id === key) {
							return { id: key, ...data };
						}
						return p;
					});
				} else {
					participants = [...participants, { id: key, ...data }];
				}
			} else if (existent) {
				participants = participants.filter((p) => p.id !== key);
			}

			onChange(participants);
		});
}
