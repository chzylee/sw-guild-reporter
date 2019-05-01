import { MDBContainer } from 'mdbreact';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import axios from 'axios';
import SWDataUtils from '../src/swDataUtils';
import SWDisplayUtils from '../src/swDisplayUtils';

class AllWeeks extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            siegeWeeks: [],
        }
    }

    componentWillMount() {
        axios.get('/api/Kingfisher/siegeMatches/id/list/all').then((response) => {
            let siegeWeeks = SWDataUtils.filterWeeks(response.data.result);
            this.setState({
                siegeWeeks: siegeWeeks
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
                            this.state.siegeWeeks.length > 0 ?
                                this.state.siegeWeeks.map((siegeWeek) => {
                                    return (
                                        <ListGroup.Item>
                                            <Link href={`/weekSummary/${siegeWeek}`}>
                                                {SWDisplayUtils.getSiegeWeekTitle(siegeWeek)}
                                            </Link>
                                        </ListGroup.Item>
                                    );
                                })
                              : <ListGroup.Item>Loading war list. . .</ListGroup.Item>
                        } {/* End render week list */}
                    </ListGroup>
                </MDBContainer>
            </MDBContainer>
        )
    }
}

export default AllWeeks;