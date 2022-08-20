const Order = require("../models/Order");
const { differenceInBusinessDays } = require("date-fns");

const getAnal = (array) => {
  const summ = array.reduce((acc, { diff }) => acc + diff, 0);
  const count = array.length;

  return { value: Math.round(summ / count * 1000) / 1000, count };
};

const getAnalytics = async (req, res) => {
  const orders = await Order.get().lean();

  const collectedData = orders.reduce(
    (acc, { date, id }) => {
      const initDate = date.init;

      if (date["gzp-pre"]) {
        const gzpPreDate = date["gzp-pre"];

        acc.gzpPre.push({
          diff: differenceInBusinessDays(gzpPreDate, initDate),
          id,
        });
      }

      if (date["gzp-build"]) {
        const gzpBuildDate = date["gzp-build"];

        acc.gzpBuild.push({
          diff: differenceInBusinessDays(gzpBuildDate, initDate),
          id,
        });
      }

      if (date["stop-pre"]) {
        const stopPreDate = date["stop-pre"];

        acc.stopPre.push({
          diff: differenceInBusinessDays(stopPreDate, initDate),
          id,
        });
      }

      if (date["stop-build"]) {
        const stopBuildDate = date["stop-build"];

        acc.stopBuild.push({
          diff: differenceInBusinessDays(stopBuildDate, initDate),
          id,
        });
      }

      return acc;
    },
    { gzpPre: [], gzpBuild: [], stopPre: [], stopBuild: [] }
  );

  const average = {
    gzpPre: getAnal(collectedData.gzpPre),
    gzpBuild: getAnal(collectedData.gzpBuild),
    stopPre: getAnal(collectedData.stopPre),
    stopBuild: getAnal(collectedData.stopBuild),
  };

  return res.json(average);
};

module.exports = { getAnalytics };
