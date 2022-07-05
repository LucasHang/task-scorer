export default interface Participant {
	name: string;
	ready: boolean;
	selectedScore: number | null;
}

export interface ParticipantWithKey extends Participant {
	key: string;
}
