const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

function setControls({ query = {}, controlsState = {}, returns = [] }) {
  const isHintActive = controlsState?.isHintActive || false;
  const isOurVarActive = controlsState?.isOurVarActive || false;
  const isSolutionActive = controlsState?.isSolutionActive || false;
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return db.STATE.findOneAndUpdate(
    query,
    {
      $set: {
        isHintActive,
        isOurVarActive,
        isSolutionActive,
      },
    },
    {
      projection,
      upsert: true,
      returnDocument: "after",
      returnNewDocument: true,
    }
  );
}

module.exports.setControls = setControls;
