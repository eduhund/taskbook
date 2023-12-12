function getOurVarCN(ourVar: boolean, isRight: boolean) {
	if (ourVar) {
		if (isRight) {
			return "correct";
		} else {
			return "wrong";
		}
	}
}

export { getOurVarCN };
