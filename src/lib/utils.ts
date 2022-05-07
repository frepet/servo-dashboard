export const clamp = (a: number, min: number, max: number) => {
	return Math.min(max, Math.max(min, a));
};
