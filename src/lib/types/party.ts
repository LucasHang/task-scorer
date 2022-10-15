import type Participant from './participant';

export default interface Party {
	id: string;
	name: string;
	participants?: Array<Participant>;
	participantsCounter: number;
}
