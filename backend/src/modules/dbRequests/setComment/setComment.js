const { STATE } = require("../../../services/mongo/mongo");

function setComment({ query = {}, data = {}, protest = false, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return STATE.findOneAndUpdate(
    query,
    {
      $push: {
        comments: {
          $each: [data],
          $position: 0,
        },
      },
      $set: {
        protest: protest,
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

module.exports = setComment;
