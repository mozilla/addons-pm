import { fetchWhiteboardTag } from 'lib/bzapi';
import { bugzilla } from 'lib/const';

export default async (req, res) => {
  const requests = [];
  const combinedData = {};

  for (const whiteboardTag of bugzilla.whiteboardTags) {
    combinedData[whiteboardTag] = {};
    requests.push(
      fetchWhiteboardTag(whiteboardTag).then((result) => {
        combinedData[whiteboardTag] = result;
      }),
    );
  }

  return Promise.all(requests).then(() => {
    res.json(combinedData);
  });
};
