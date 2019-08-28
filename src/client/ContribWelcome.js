import BaseContrib from './Contrib';
import Client from './Client';

class ContribWelcome extends BaseContrib {
  state = {
    contribWelcome: null,
    dataKey: 'contribWelcome',
  };

  async componentDidMount() {
    const contribWelcome = await Client.getContribWelcome();
    this.setState({
      contribWelcome: this.formatData(
        contribWelcome.data.contrib_welcome.results,
      ),
    });
  }
}

export default ContribWelcome;
