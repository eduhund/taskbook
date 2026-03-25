function isIsoDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeISODate(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0];
  }

  if (typeof value !== "string") {
    return null;
  }

  if (isIsoDateString(value)) {
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0] === value ? value : null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().split("T")[0];
}

module.exports = { normalizeISODate };
