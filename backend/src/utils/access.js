const { normalizeISODate } = require("./date");

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
  const baseDeadline = normalizeISODate(deadline);
  const prolongationDeadlines = (prolongations || [])
    .map((item) => normalizeISODate(item?.until))
    .filter(Boolean);

  const allDeadlines = [baseDeadline, ...prolongationDeadlines].filter(Boolean);
  if (allDeadlines.length === 0) {
    return undefined;
  }

  allDeadlines.sort((a, b) => Date.parse(b) - Date.parse(a));
  return allDeadlines[0];
}

module.exports = { getDeadline };
