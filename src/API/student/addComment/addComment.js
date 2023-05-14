const { pushComment } = require("@processes");

/***
 * addComment StudentAPI method.
 * https://api.eduhund.com/docs/student#addComment
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Comments list on success; undefined on fail
 */
async function addComment(req, res, next) {
	try {
		const { data } = req;

		const content = await pushComment(data, next);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20209, trace: e };
		next(err);
		return;
	}
}

module.exports = addComment;
