import { MDBContainer } from 'mdbreact';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import axios from 'axios';
import DisplayFormatter from '../src/displayFormatter';

class AllWars extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
        }
    }

    componentWillMount() {
        axios.get('/api/Kingfisher/siegeMatches/id/list/all').then((response) => {
            this.setState({
                siegeMatches: response.data.result
            });
        });
    }

    renderSiegeList()
    {
        return (
            <ListGroup>
                { 
                    this.state.siegeMatches.length > 0 ?
                        this.state.siegeMatches.map((siegeMatch) => {
                            const siegeID = siegeMatch.siege_id;
                            return (
                                <ListGroup.Item>
                                    <Link href={`/siegeMatch/${siegeID}`}>{DisplayFormatter.getSiegeDateTitle(siegeID)}</Link>
                                </ListGroup.Item>
                            );
                        })
                        : <ListGroup.Item>Loading war list. . .</ListGroup.Item>
                } {/* End render war list */}
            </ListGroup>
        );
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    <h1>All Siege Wars</h1>
                </MDBContainer>
                <MDBContainer className="ListWrapper">
                    { this.renderSiegeList() }
                </MDBContainer>
            </MDBContainer>
        )
    }
}

export default AllWars;