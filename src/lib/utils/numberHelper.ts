export function roundTwoCases(num: number) {
	return +(Math.round(Number(num + 'e+2')) + 'e-2');
}

export function decimalToPercentage(decimal: number) {
	return roundTwoCases(decimal * 100);
}
