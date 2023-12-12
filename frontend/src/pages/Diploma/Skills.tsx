function Skills({ skillsList }: any) {
	const skills = (skillsList || []).map((skill: any) => {
		const subskills = (skill?.subskills || []).map((subskill: any) => {
			const getState = (progress: any) => {
				if (progress >= 80) {
					return "отлично";
				} else if (progress >= 70) {
					return "очень хорошо";
				} else if (progress >= 60) {
					return "хорошо";
				} else {
					return "в процессе";
				}
			};
			const getClassName = (progress: any) => {
				if (progress >= 80) {
					return "skill__state__perfect";
				} else if (progress >= 70) {
					return "skill__state__verygood";
				} else if (progress >= 60) {
					return "skill__state__good";
				} else {
					return "skill__state__inprogress";
				}
			};
			return (
				<tr>
					<td>{subskill?.code}</td>
					<td>{subskill?.name}</td>
					<td>{subskill?.progress}%</td>
					<td className={getClassName(subskill?.progress)}>
						{getState(subskill?.progress)}
					</td>
				</tr>
			);
		});
		return (
			<table>
				<tr>
					<th></th>
					<th>{skill?.name}</th>
					<th>{skill?.progress}%</th>
					<th></th>
				</tr>
				{subskills}
			</table>
		);
	});
	return (
		<div id="skills" className="cert__skills">
			{skills}
		</div>
	);
}

export { Skills };
