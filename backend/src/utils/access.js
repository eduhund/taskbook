/**
 * Calculate deadline for user's module
 *
 * @param {String} date Date of start
 * @param {Number} duration Days number of access
 * @param {Array} prolongations List of users's prolongations
 *
 * @returns {String} Date of deadline
 */
function getDeadline({ deadline, prolongations = [] }) {
  if (prolongations.length === 0) return deadline;

  if (prolongations.length > 1) {
    prolongations.sort((a, b) => {
      if (!a?.until && !b?.until) return 0;
      if (!a?.until) return 1;
      if (!b?.until) return -1;
      return Date.parse(b.until) - Date.parse(a.until);
    });
  }

  return prolongations[0]?.until > deadline
    ? prolongations[0]?.until
    : deadline;
}

module.exports = { getDeadline };
