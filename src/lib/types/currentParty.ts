export default interface CurrentParty {
	partyId: string;
	participantId?: string;
	role: 'host' | 'guest';
}
