function getNumberOfDoneTasks(state) {
  const practiceTasks = state.filter((task) => task.isChecked !== undefined);
  return practiceTasks.length;
}

module.exports.getNumberOfDoneTasks = getNumberOfDoneTasks;
