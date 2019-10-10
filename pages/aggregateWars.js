import { MDBContainer } from 'mdbreact';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import axios from 'axios';
import SWDisplayUtils from '../src/swDisplayUtils';
import { Button } from 'react-bootstrap';

class AggregateWars extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
            selected: [],
            route: '',
        }
    }

    static async getInitialProps({ query }) {
        const selectedSieges = query.selectedSieges ? query.selectedSieges : [];
        return { selectedSieges };
    }

    componentWillMount() {
        axios.get('/api/Kingfisher/siegeMatches/id/list/all').then((response) => {
            this.setState({
                siegeMatches: response.data.result,
                selected: this.props.selectedSieges,
                route: this.getRouteForSelected(this.props.selectedSieges),
            });
        });
    }

    selectSiegeMatch(siegeID) {
        let selectedSieges = this.state.selected;
        let siegeIndex = selectedSieges.indexOf(siegeID);
        if (siegeIndex > -1) {
            selectedSieges.splice(siegeIndex, 1);
        } else {
            selectedSieges.push(siegeID);
        }

        this.setState({
            siegeMatches: this.state.siegeMatches,
            selected: selectedSieges,
            route: this.getRouteForSelected(selectedSieges),
        });
    }

    getRouteForSelected(selectedSieges) {
        return selectedSieges.toString().replace(/,/g, '+');
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    <h1>Select Siege Wars to Aggregate</h1>
                </MDBContainer>
                <MDBContainer id="SelectedList">
                    <h2>Selected Siege Wars</h2>
                    <ListGroup>
                        { 
                            this.state.selected.map((siegeID) => {
                                return (
                                    <ListGroup.Item>
                                        {SWDisplayUtils.getSiegeDateTitle(siegeID)}
                                    </ListGroup.Item>
                                );
                            })
                        } {/* End render war list */}
                    </ListGroup>
                </MDBContainer>
                <MDBContainer className="ListWrapper">
                    <ListGroup>
                        { 
                            this.state.siegeMatches.length > 0 ?
                                this.state.siegeMatches.map((siegeMatch) => {
                                    const siegeID = siegeMatch.siege_id;
                                    return (
                                        <ListGroup.Item 
                                            active={this.state.selected.includes(siegeID)}
                                            onClick={() => this.selectSiegeMatch(siegeID)} 
                                            key={siegeID}
                                        >
                                            {SWDisplayUtils.getSiegeDateTitle(siegeID)}
                                        </ListGroup.Item>
                                    );
                                })
                              : <ListGroup.Item>Loading war list. . .</ListGroup.Item>
                        } {/* End render war list */}
                    </ListGroup>
                </MDBContainer>
                <Button href={`/aggregateSummary/${this.state.route}`} id="GoButton">Go</Button>
            </MDBContainer>
        )
    }
}

export default AggregateWars;