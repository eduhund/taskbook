function extractId(id: any) {
	return {
		module: id.substring(0, 3) || undefined,
		lesson: id.substring(3, 5) || undefined,
		task: id.substring(5, 7) || undefined,
	};
}

export { extractId };
