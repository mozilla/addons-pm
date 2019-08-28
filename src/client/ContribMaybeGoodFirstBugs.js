import BaseContrib from './Contrib';
import Client from './Client';

class MaybeGoodFirstBugs extends BaseContrib {
  state = {
    maybeGoodFirstBugs: null,
    dataKey: 'maybeGoodFirstBugs',
  };

  async componentDidMount() {
    const maybeGoodFirstBugs = await Client.getMaybeGoodFirstBugs();
    this.setState({
      maybeGoodFirstBugs: this.formatData(
        maybeGoodFirstBugs.data.maybe_good_first_bugs.results,
      ),
    });
  }
}

export default MaybeGoodFirstBugs;
