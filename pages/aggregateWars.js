import { MDBContainer } from 'mdbreact';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import DisplayFormatter from '../src/displayFormatter';
import { Button } from 'react-bootstrap';

class AggregateWars extends React.Component {   

    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
            selected: [],
            route: '',
        }
        // Currently set at 6 (3 weeks of wars).
        this.selectionLimit = 6;
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
        } else if (selectedSieges.length < this.selectionLimit) {
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

    renderSelectedList() {
        return (
            <ListGroup>
                { 
                    this.state.selected.map((siegeID) => {
                        return (
                            <ListGroup.Item key={siegeID}>
                                {DisplayFormatter.getSiegeDateTitle(siegeID)}
                            </ListGroup.Item>
                        );
                    })
                } {/* End render war list */}
            </ListGroup>
        );
    }

    renderWarList() {
        return (
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
                                    {DisplayFormatter.getSiegeDateTitle(siegeID)}
                                </ListGroup.Item>
                            );
                        })
                        : <ListGroup.Item>Loading war list. . .</ListGroup.Item>
                } {/* End render war list */}
            </ListGroup>
        );
    }

    renderLimitWarning() {
        if (this.state.selected.length >= this.selectionLimit) {
            return (
                <h4 className="Note">Aggregation limit is {this.selectionLimit} wars</h4>
            );
        }
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    <h1>Select Siege Wars to Aggregate</h1>
                </MDBContainer>
                <MDBContainer id="SelectedList">
                    <h2>Selected Siege Wars</h2>
                    { this.renderSelectedList() }
                    { this.renderLimitWarning() }
                </MDBContainer>
                <MDBContainer className="ListWrapper">
                    { this.renderWarList() }
                </MDBContainer>
                <Button href={`/aggregateSummary/${this.state.route}`} id="GoButton">Go</Button>
            </MDBContainer>
        )
    }
}

export default AggregateWars;