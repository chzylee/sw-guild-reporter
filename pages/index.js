import { MDBContainer } from "mdbreact";
import axios from 'axios';
import SWDisplayUtils from '../src/swDisplayUtils';

import SiegeMatchHeader from '../src/components/SiegeMatchHeader/SiegeMatchHeader';
import BattleLogTable from '../src/components/BattleLogTable/BattleLogTable';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siegeID: 0,
            siegeGuilds: [],
            attackLogs: {},
            defenseLogs: {}
        };
    }

    static async getInitialProps({ query }) {
        const apiRoute = query.siegeMatchID ? `id/${query.siegeMatchID}` : 'latest';
        return { apiRoute };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/db/Kingfisher/siegeMatches/${this.props.apiRoute}`),
            axios.get(`/db/Kingfisher/battleLogs/attack/${this.props.apiRoute}`),
            axios.get(`/db/Kingfisher/battleLogs/defense/${this.props.apiRoute}`),
        ]).then(axios.spread((siegeMatch, attackLogs, defenseLogs) => {
            this.setState({
                siegeID: siegeMatch.data.result.siege_id,
                siegeGuilds: siegeMatch.data.result.guild_list,
                attackLogs: attackLogs.data.result,
                defenseLogs: defenseLogs.data.result
            });
        }));
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    {/* Matches more commonly known to players as wars */}
                    <h1>Siege War Data</h1>
                    { 
                        this.state.siegeID ? 
                            <h3>{SWDisplayUtils.getSiegeDateTitle(this.state.siegeID)}</h3> 
                          : <h4>Loading siege match data. . .</h4>
                    }
                </MDBContainer>
                { 
                    this.state.siegeGuilds.length === 3 ? 
                        <SiegeMatchHeader guildList={this.state.siegeGuilds} /> 
                      : <div>Loading guild info. . .</div>
                }
                { 
                    this.state.attackLogs ? 
                        <BattleLogTable logs={this.state.attackLogs} /> 
                      : <div>Loading attack logs. . .</div>
                }
                { 
                    this.state.defenseLogs ? 
                        <BattleLogTable logs={this.state.defenseLogs} /> 
                      : <div>Loading attack logs. . .</div>
                }
            </MDBContainer>
        );
    }
}

export default Index;