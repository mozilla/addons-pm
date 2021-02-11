import { fetchNeedInfo, baseWEBURL } from 'lib/bzapi';

export default async (req, res) => {
  const requests = [];
  const combinedData = {};
  const BZ_USERS = JSON.parse(process.env.BZ_USERS) || {};

  for (const nick in BZ_USERS) {
    if (Object.prototype.hasOwnProperty.call(BZ_USERS, nick)) {
      combinedData[nick] = {};
      requests.push(
        fetchNeedInfo(BZ_USERS[nick]).then((result) => {
          combinedData[nick].count = result.bugs.length;
          if (result.bugs.length) {
            combinedData[nick].url = `${baseWEBURL}?bug_id=${result.bugs
              .map((item) => item.id)
              .join(',')}`;
          }
        }),
      );
    }
  }

  return Promise.all(requests).then(() => {
    res.json(combinedData);
  });
};
