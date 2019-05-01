import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import axios from 'axios';
import SWDisplayUtils from '../src/swDisplayUtils';

import WeekBattleLogTable from "../src/components/BattleLogTable/WeekBattleLogTable";
import SiegeMatchCard from "../src/components/SiegeMatchCard/SiegeMatchCard";

class WeekSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
            attackLogs: [],
            defenseLogs: []
        };
    }

    static async getInitialProps({ query }) {
        const siegeWeekID = `${query.siegeWeekID}`;
        return { siegeWeekID };
    }

    componentWillMount() {
        axios.all([
            axios.get(`/api/Kingfisher/siegeMatches/week/${this.props.siegeWeekID}`),
            axios.get(`/api/Kingfisher/battleLogs/attack/week/${this.props.siegeWeekID}`),
            axios.get(`/api/Kingfisher/battleLogs/defense/week/${this.props.siegeWeekID}`),
        ]).then(axios.spread((siegeMatches, attackLogs, defenseLogs) => {
            this.setState({
                siegeMatches: siegeMatches.data.result, 
                attackLogs: attackLogs.data.result,
                defenseLogs: defenseLogs.data.result
            });
        }))
        .catch((error) => {
            this.setState({
                error: 'Could not find week data'
            });
        });
    }

    render() {
        if (this.state.error) {
            return (
                <MDBContainer fluid className="PageWrapper">
                    <MDBContainer fluid className="Title">
                        <h2>{SWDisplayUtils.getSiegeWeekTitle(this.props.siegeWeekID)}</h2>
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
                            { 
                                this.props.siegeWeekID.length > 0 ? 
                                    <h2>{SWDisplayUtils.getSiegeWeekTitle(this.props.siegeWeekID)}</h2>
                                  : <h3>Loading week data. . .</h3>
                            }
                        </MDBRow>
                        <MDBRow center>
                            <MDBCol>
                                { 
                                    this.state.siegeMatches.length > 0 ?
                                        <SiegeMatchCard siegeMatchData={this.state.siegeMatches[0]} />
                                      : <div>Monday-Tuesday War</div>
                                }
                            </MDBCol>
                            <MDBCol>
                                { 
                                    this.state.siegeMatches.length > 0 ?
                                        <SiegeMatchCard siegeMatchData={this.state.siegeMatches[1]} />
                                      : <div>Thursday-Friday War</div>
                                }
                            </MDBCol>
                        </MDBRow> {/* End siege match card row */}
                    </MDBContainer>
                    { 
                        this.state.attackLogs.length > 0 ?
                            <WeekBattleLogTable logs={this.state.attackLogs}/>
                          : <div>Loading attack log data. . .</div>
                    }
                    { 
                        this.state.defenseLogs.length > 0 ?
                            <WeekBattleLogTable logs={this.state.defenseLogs}/>
                          : <div>Loading defense log data. . .</div>
                    }
                </MDBContainer>
            );
        }
    }
}

export default WeekSummary;