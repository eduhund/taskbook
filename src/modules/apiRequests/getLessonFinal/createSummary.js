function createSummary(score, maxScore) {
  const percent = Math.trunc(((score || 0) / (maxScore || 0)) * 100);
  if (percent >= 80)
    return "Набранных баллов достаточно для получения сертификата с отличием";
  else if (percent < 60)
    return "Набранных баллов недостаточно для получения сертификата. Если он вам нужен, дорешайте и перерешайте задачи урока.";
  else
    return "Набранных баллов достаточно для обычного сертификата. Если вы хотите сертификат с отличием, перерешайте некоторые задачи и наберите больше баллов.";
}

module.exports.createSummary = createSummary;
