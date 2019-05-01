import { MDBContainer } from 'mdbreact';
import axios from 'axios';
import SiegeDeckPills from '../src/components/SiegeDeckPills/SiegeDeckPills';

class SiegeDecks extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        }
    }

    componentWillMount() {
        axios.get('/api/Kingfisher/siegeDecks').then((response) => {
            this.setState({
                players: response.data.result,
            });
        });
    }

    render() {
        return (
            <MDBContainer fluid className="PageWrapper">
                <MDBContainer fluid className="Title">
                    <h1>Kingfisher Siege Decks</h1>
                </MDBContainer>
                <MDBContainer className="DeckContainer">
                    { 
                        this.state.players.length > 0 ?
                            <SiegeDeckPills players={this.state.players} />
                          : <div>Loading siege decks. . .</div>
                    }
                </MDBContainer>
            </MDBContainer>
        )
    }
}

export default SiegeDecks;