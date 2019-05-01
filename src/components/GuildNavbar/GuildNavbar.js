import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import SWDisplayUtils from '../../swDisplayUtils';
import './GuildNavbar.css';
    
class GuildNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = { // self-contained state because used at base _app level only
            recentMatches: []
        };
    }

    componentWillMount() {
        axios.get('/db/Kingfisher/siegeMatches/id/list/recent').then((response) => {
            this.setState({
                recentMatches: response.data.result
            });
        });
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg" className="GuildNavbar">
                <Container className="NavContentWrapper">
                    <Navbar.Brand href="/">{this.props.guildName}</Navbar.Brand>
                    <Nav justify className="MainNav" >
                        <Nav.Link href="/">Latest War</Nav.Link>
                        <Nav.Link href="/allWeeks">Data by Week</Nav.Link>
                        <Nav.Link href="/siegeDecks">Siege Decks</Nav.Link>
                        <NavDropdown title="Recent Wars" id="basic-nav-dropdown">
                            {   // does not worry about length of list first because rendered at _app level
                                this.state.recentMatches.map((siegeMatch) => {
                                    const siegeID = siegeMatch.siege_id;
                                    const route = `/siegeMatch/${siegeID}`
                                    return (
                                        <NavDropdown.Item key={siegeID} href={route}>
                                            {SWDisplayUtils.getSiegeDateLabel(siegeID)}
                                        </NavDropdown.Item>
                                    );
                                })
                            } {/* End render recent siege list */}
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/allWars">See all</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default GuildNavbar;