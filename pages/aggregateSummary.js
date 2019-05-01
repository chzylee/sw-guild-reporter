import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import axios from 'axios';
import SWDisplayUtils from '../src/swDisplayUtils';

import AggregateBattleLogTable from "../src/components/BattleLogTable/AggregateBattleLogTable";
import SiegeMatchCard from "../src/components/SiegeMatchCard/SiegeMatchCard";

class AggregateSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
            attackLogs: [],
            defenseLogs: []
        };
    }

    static async getInitialProps({ query }) {
        const selectedSieges = query.selectedSieges ? query.selectedSieges : [];
        const apiRoute = query.apiRoute ? query.apiRoute : '';
        return { selectedSieges, apiRoute };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/Kingfisher/siegeMatches/id/${this.props.apiRoute}`),
            axios.get(`/api/Kingfisher/battleLogs/attack/id/${this.props.apiRoute}`),
            axios.get(`/api/Kingfisher/battleLogs/defense/id/${this.props.apiRoute}`),
        ]).then(axios.spread((siegeMatches, attackLogs, defenseLogs) => {
            this.setState({
                siegeMatches: siegeMatches.data.result, 
                attackLogs: attackLogs.data.result,
                defenseLogs: defenseLogs.data.result
            });
        }))
        .catch((error) => {
            this.setState({
                error: 'Could not find aggregated data'
            });
        });
    }

    render() {
        if (this.state.error) {
            return (
                <MDBContainer fluid className="PageWrapper">
                    <MDBContainer fluid className="Title">
                        <h2>Aggregated Siege War Data</h2>
                        <h3 className="Error">{this.state.error}</h3>
                    </MDBContainer>
                </MDBContainer>
            );
        } else {
            return (
                <MDBContainer fluid className="PageWrapper">
                    <MDBContainer fluid className="Title">
                        <MDBRow center>
                            <h1>Kingfisher Siege Info</h1>
                        </MDBRow>
                        <MDBRow center>
                            <h2>Aggregated Siege War Data</h2>
                        </MDBRow>
                        <MDBRow center>
                            {
                                this.state.siegeMatches.map((siegeMatch) => {
                                    return (
                                        <SiegeMatchCard siegeMatchData={siegeMatch} />
                                    )
                                })
                            }
                        </MDBRow>
                    </MDBContainer>
                    {/* { 
                        this.state.attackLogs.length > 0 ?
                            <AggregateBattleLogTable logs={this.state.attackLogs}/>
                          : <div>Loading attack log data. . .</div>
                    }
                    { 
                        this.state.defenseLogs.length > 0 ?
                            <AggregateBattleLogTable logs={this.state.defenseLogs}/>
                          : <div>Loading defense log data. . .</div>
                    } */}
                </MDBContainer>
            );
        }
    }
}

export default AggregateSummary;