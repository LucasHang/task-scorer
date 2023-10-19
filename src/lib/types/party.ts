import type Participant from './participant';

export default interface Party {
	id: string;
	name: string;
	scoreSystem: Array<string>;
	participants: Array<Participant>;
}
