import {
  getCurrentQuarter,
  getNextQuarter,
  getPrevQuarter,
  parseProjectMeta,
} from 'lib/utils/projects';

describe(__filename, () => {
  describe('getCurrentQuarter()', () => {
    it('should provide the quarter and year', () => {
      const startDate = new Date('2019', '3', '9');
      const { quarter, year } = getCurrentQuarter({ _date: startDate });
      expect(quarter).toBe('Q2');
      expect(year).toBe(2019);
    });
  });

  describe('getNextQuarter()', () => {
    it('should get next quarter', () => {
      const { quarter, year } = getNextQuarter({ quarter: 'Q1', year: 2020 });
      expect(quarter).toBe('Q2');
      expect(year).toBe(2020);
    });

    it('should rotate to q1 next year', () => {
      const { quarter, year } = getNextQuarter({ quarter: 'Q4', year: 2020 });
      expect(quarter).toBe('Q1');
      expect(year).toBe(2021);
    });

    it('should return an empty object for incomplete data', () => {
      const { quarter, year } = getNextQuarter({ year: 2020 });
      expect(quarter).toEqual(undefined);
      expect(year).toEqual(undefined);
    });
  });

  describe('getPrevQuarter()', () => {
    it('should get prev quarter', () => {
      const { quarter, year } = getPrevQuarter({ quarter: 'Q2', year: 2020 });
      expect(quarter).toBe('Q1');
      expect(year).toBe(2020);
    });

    it('should rotate to q4 last year', () => {
      const { quarter, year } = getPrevQuarter({ quarter: 'Q1', year: 2020 });
      expect(quarter).toBe('Q4');
      expect(year).toBe(2019);
    });

    it('should return an empty object for incomplete data', () => {
      const { quarter, year } = getPrevQuarter({ year: 2020 });
      expect(quarter).toEqual(undefined);
      expect(year).toEqual(undefined);
    });
  });

  describe('parseProjectMeta()', () => {
    const projectMetaHTML = `<details open="">
      <summary>Project Metadata</summary>
      <dl>
        <dt>Engineering</dt>
        <dd>@bobsilverberg</dd>
        <dt>Goal Type</dt>
        <dd>Primary</dd>
        <dt>Size</dt>
        <dd>M</dd>
      </dl>
    </details>`;

    it('should find engineer in meta', () => {
      const [meta] = parseProjectMeta(projectMetaHTML);
      expect(meta.engineers[0]).toEqual('bobsilverberg');
    });

    it('should find goal type in meta', () => {
      const [meta] = parseProjectMeta(projectMetaHTML);
      expect(meta.goalType).toEqual('primary');
    });

    it('should find goal size in meta', () => {
      const [meta] = parseProjectMeta(projectMetaHTML);
      expect(meta.size).toEqual('M');
    });

    it('should handle multiple engineers', () => {
      const projectMetaHTMLMultipleEng = `<details open="">
        <summary>Project Metadata</summary>
        <dl>
          <dt>Engineering</dt>
          <dd>@bobsilverberg, @diox</dd>
          <dt>Goal Type</dt>
          <dd>Primary</dd>
          <dt>Size</dt>
          <dd>M</dd>
        </dl>
      </details>`;

      const [meta] = parseProjectMeta(projectMetaHTMLMultipleEng);
      expect(meta.engineers[0]).toEqual('bobsilverberg');
      expect(meta.engineers[1]).toEqual('diox');
    });
  });
});
