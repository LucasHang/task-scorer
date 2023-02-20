import type Participant from './participant';

export default interface Party {
	id: string;
	name: string;
	scoreSystem: Array<number>;
	participants: Array<Participant>;
}
