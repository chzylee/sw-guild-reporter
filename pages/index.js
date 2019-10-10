import { MDBContainer } from 'mdbreact';
import axios from 'axios';
import DisplayFormatter from '../src/displayFormatter';

import SiegeMatchHeader from '../src/components/SiegeMatchHeader/SiegeMatchHeader';
import BattleLogTable from '../src/components/BattleLogTable/BattleLogTable';
import { Button } from "react-bootstrap";

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
        // Get latest siege match if not given one.
        const apiRoute = query.siegeMatchID ? `id/${query.siegeMatchID}` : 'latest';
        return { apiRoute };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/Kingfisher/siegeMatches/${this.props.apiRoute}`),
            axios.get(`/api/Kingfisher/battleLogs/attack/${this.props.apiRoute}`),
            axios.get(`/api/Kingfisher/battleLogs/defense/${this.props.apiRoute}`),
        ]).then(axios.spread((siegeMatch, attackLogs, defenseLogs) => {
            this.setState({
                siegeID: siegeMatch.data.result.siege_id,
                siegeGuilds: siegeMatch.data.result.guild_list,
                attackLogs: attackLogs.data.result,
                defenseLogs: defenseLogs.data.result
            });
        }));
    }

    showAddWarsButton() {
        if (this.state.siegeID) {
            return (
                <Button 
                    variant="primary" 
                    active 
                    href={`/aggregateWars/${this.state.siegeID}`} 
                    id="AddWarsButton"
                >
                    +
                </Button>
            );
        }
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    {/* Matches more commonly known to players as wars */}
                    <h1>Siege War Data</h1>
                    { 
                        this.state.siegeID ? 
                            <h3>{DisplayFormatter.getSiegeDateTitle(this.state.siegeID)}</h3> :
                            <h4>Loading siege match data. . .</h4>
                    }
                </MDBContainer>
                { this.showAddWarsButton() }
                { 
                    this.state.siegeGuilds.length === 3 ? 
                        <SiegeMatchHeader guildList={this.state.siegeGuilds} /> :
                        <div>Loading guild info. . .</div>
                }
                { 
                    this.state.attackLogs ? 
                        <BattleLogTable logs={this.state.attackLogs} /> :
                        <div>Loading attack logs. . .</div>
                }
                { 
                    this.state.defenseLogs ? 
                        <BattleLogTable logs={this.state.defenseLogs} /> :
                        <div>Loading attack logs. . .</div>
                }
                
            </MDBContainer>
        );
    }
}

export default Index;