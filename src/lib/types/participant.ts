export default interface Participant {
	id: string;
	name: string;
	ready: boolean;
	selectedScore: number | null;
}
