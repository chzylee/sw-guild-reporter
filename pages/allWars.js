import { MDBContainer } from 'mdbreact';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import axios from 'axios';
import SWDisplayUtils from '../src/swDisplayUtils';

class AllWars extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            siegeMatches: [],
        }
    }

    componentWillMount() {
        axios.get('/db/Kingfisher/siegeMatches/id/list/all').then((response) => {
            this.setState({
                siegeMatches: response.data.result
            });
        });
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    <h1>All Siege Wars</h1>
                </MDBContainer>
                <MDBContainer className="ListWrapper">
                    <ListGroup>
                        { 
                            this.state.siegeMatches.length > 0 ?
                                this.state.siegeMatches.map((siegeMatch) => {
                                    const siegeID = siegeMatch.siege_id;
                                    return (
                                        <ListGroup.Item>
                                            <Link href={`/siegeMatch/${siegeID}`}>{SWDisplayUtils.getSiegeDateTitle(siegeID)}</Link>
                                        </ListGroup.Item>
                                    );
                                })
                              : <ListGroup.Item>Loading war list. . .</ListGroup.Item>
                        } {/* End render war list */}
                    </ListGroup>
                </MDBContainer>
            </MDBContainer>
        )
    }
}

export default AllWars;