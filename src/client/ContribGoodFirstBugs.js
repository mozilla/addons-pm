import BaseContrib from './Contrib';
import Client from './Client';

class GoodFirstBugs extends BaseContrib {
  state = {
    goodFirstBugs: null,
    dataKey: 'goodFirstBugs',
  };

  async componentDidMount() {
    const goodFirstBugs = await Client.getGoodFirstBugs();
    this.setState({
      goodFirstBugs: this.formatData(
        goodFirstBugs.data.good_first_bugs.results,
      ),
    });
  }
}

export default GoodFirstBugs;
