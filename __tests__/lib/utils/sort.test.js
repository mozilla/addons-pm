import { alphaSort, dateSort, numericSort, sortData } from 'lib/utils/sort';

describe(__filename, () => {
  describe('dateSort()', () => {
    const data = [
      { date: '2019-03-25T17:27:07Z' },
      { date: '2019-03-20T15:51:59Z' },
    ];

    it('sorts dates', () => {
      const result = [].concat(data).sort(dateSort('date'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('numericSort()', () => {
    const data = [{ num: 2 }, { num: 1 }];

    it('sorts numbers', () => {
      const result = [].concat(data).sort(numericSort('num'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('alphaSort()', () => {
    const data = [
      { letters: 'bbcc' },
      { letters: 'aabbcc' },
      { letters: 'cccddd' },
      { letters: 'bbcc' },
    ];

    it('sorts letters', () => {
      const result = [].concat(data).sort(alphaSort('letters'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('sortData()', () => {
    const data = [
      { letters: 'bbcc', date: '2019-03-25T17:27:07Z' },
      { letters: 'aabbcc', date: '2019-02-12T12:22:07Z' },
      { letters: 'cccddd', date: '2018-12-23T07:12:07Z' },
      { letters: 'bbcc', date: '2016-06-25T10:07:07Z' },
    ];
    const sortConfig = {
      letters: {},
      date: {
        sortFunc: dateSort,
      },
    };

    it('sorts standard data', () => {
      const sorted = sortData({
        data,
        columnKey: 'letters',
        direction: 'asc',
        sortConfig,
      });
      expect(sorted[0].letters).toBe('aabbcc');
      expect(sorted[3].letters).toBe('cccddd');
    });

    it('sorts standard data by specified direction', () => {
      const sorted = sortData({
        data,
        columnKey: 'letters',
        direction: 'desc',
        sortConfig,
      });
      expect(sorted[0].letters).toBe('cccddd');
      expect(sorted[3].letters).toBe('aabbcc');
    });

    it('sorts dates', () => {
      const sorted = sortData({
        data,
        columnKey: 'date',
        direction: 'asc',
        sortConfig,
      });
      expect(sorted[0].date).toBe('2016-06-25T10:07:07Z');
      expect(sorted[3].date).toBe('2019-03-25T17:27:07Z');
    });

    it('sorts dates by specified direction', () => {
      const sorted = sortData({
        data,
        columnKey: 'date',
        direction: 'desc',
        sortConfig,
      });
      expect(sorted[0].date).toBe('2019-03-25T17:27:07Z');
      expect(sorted[3].date).toBe('2016-06-25T10:07:07Z');
    });

    it('returns data unchanged if falsey', () => {
      const sorted = sortData({ data: null });
      expect(sorted).toBe(null);
    });
  });
});
