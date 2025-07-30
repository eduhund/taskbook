const { PAYMENTS } = require("../../../services/mongo/mongo");

function getPaymentInfo({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return PAYMENTS.findOne(query, { projection });
}

module.exports = getPaymentInfo;
