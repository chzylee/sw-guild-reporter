import React, { Component } from 'react';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import { Tab, Tabs, ListGroup, Modal, Button } from 'react-bootstrap';
import PlayerDeckUtils from '../../dataUtils/playerDeckUtils';
import DisplayFormatter from '../..//displayFormatter';
import './SiegeDeckPills.css';

class SiegeDeckPills extends Component {
    // use state despite being child component to decouple navigation functionality from parent
    constructor(props) {
        super(props);
        this.state = {
            key: 'player',
            showModal: new Array(props.players.length).fill(false),
        }
        this.allGuildComps = PlayerDeckUtils.getUniqueComps(props.players);

        // simplified references for long accesses
        this.halfPlayers = Math.ceil(props.players.length / 2);
        this.totalPlayers = props.players.length;
        this.halfComps = Math.ceil(this.allGuildComps.length / 2);
        this.totalComps = this.allGuildComps.length;
    }

    handleShow(playerIndex) {
        console.log(playerIndex);
        let showModalUpdate = this.state.showModal.slice();
        showModalUpdate[playerIndex] = true;
        this.setState({
            key: this.state.key,
            showModal: showModalUpdate,
        });
    }

    handleClose(playerIndex) {
        let showModalUpdate = this.state.showModal.slice();
        showModalUpdate[playerIndex] = false;
        this.setState({
            key: this.state.key,
            showModal: showModalUpdate,
        });
    }

    render() {
        const firstHalfPlayers = this.props.players.slice(0, this.halfPlayers);
        const secondHalfPlayers = this.props.players.slice(this.halfPlayers, this.totalPlayers);
        const firstHalfComps = this.allGuildComps.slice(0, this.halfComps);
        const secondHalfComps = this.allGuildComps.slice(this.halfComps, this.totalComps);
        return (
            <MDBContainer fluid className="SiegeDeckPills nav-justified">
                {/* Demo Tabs activeKey and onSelect config from docs at https://react-bootstrap.github.io/components/tabs/#tabs-props */}
                <Tabs
                    variant="pills"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                >
                    <Tab eventKey="player" title="Player">
                        <MDBRow>
                            <MDBCol>
                                <ListGroup>
                                {
                                    Object.keys(firstHalfPlayers).map((playerIndex) => {
                                        const player = firstHalfPlayers[playerIndex];
                                        return (
                                            <ListGroup.Item 
                                                key={player.player_id}
                                                onClick={() => this.handleShow(playerIndex)}
                                            >
                                                {player.player_name}
                                            </ListGroup.Item>
                                        );
                                    })
                                }
                                </ListGroup>
                            </MDBCol> {/* End first half players list column */}
                            <MDBCol>
                                <ListGroup>
                                {
                                    Object.keys(secondHalfPlayers).map((playerIndex) => {
                                        const player = secondHalfPlayers[playerIndex];
                                        // offset index from second half to match correct index in original list
                                        const originalIndex = parseInt(playerIndex, 10) + this.halfPlayers;
                                        return (
                                            <ListGroup.Item 
                                                key={player.player_id}
                                                onClick={() => this.handleShow(originalIndex)}
                                            >
                                                {player.player_name}
                                            </ListGroup.Item>
                                        );
                                    })
                                }
                                </ListGroup>
                            </MDBCol> {/* End second half players list column */}
                        </MDBRow>
                    </Tab>
                    <Tab eventKey="guild" title="Guild">
                        <MDBRow>
                            <MDBCol>
                                <ListGroup>
                                {
                                    Object.keys(firstHalfComps).map((compIndex) => {
                                        const comp = firstHalfComps[compIndex];
                                        return (
                                            <ListGroup.Item key={comp.monsters}>
                                                {comp.monsters}
                                            </ListGroup.Item>
                                        );
                                    })
                                }
                                </ListGroup>
                            </MDBCol>  {/* End first half comps list column */}
                            <MDBCol>
                                <ListGroup>
                                {
                                    Object.keys(secondHalfComps).map((compIndex) => {
                                        const comp = secondHalfComps[compIndex];
                                        return (
                                            <ListGroup.Item key={comp.monsters}>
                                                {comp.monsters}
                                            </ListGroup.Item>
                                        );
                                    })
                                }
                                </ListGroup>
                            </MDBCol>  {/* End second half comps list column */}
                        </MDBRow>
                    </Tab>
                </Tabs>
                {/* Modals for each player's deck data */}
                <MDBContainer className="PlayerModals">
                    {
                        Object.keys((this.props.players)).map((playerIndex) => {
                            const player = this.props.players[playerIndex];
                            return (
                                <Modal 
                                    key={player.player_id}
                                    show={this.state.showModal[playerIndex]} 
                                    onHide={() => this.handleClose(playerIndex)}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>{player.player_name}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {
                                            player.defenses.map((defenseDeck) => {
                                                return (
                                                    <MDBContainer className="PlayerDeck">
                                                        <h4>{DisplayFormatter.formatSiegeDeckMonsters(defenseDeck.monsters)}</h4>
                                                        <strong>Record: </strong>
                                                        <span>{defenseDeck.successes}-{defenseDeck.fails}</span>
                                                        <span className="SuccessRate">({DisplayFormatter.formatDeckSuccessRate(defenseDeck.success_rate)} win rate)</span>
                                                    </MDBContainer>
                                                )
                                            })
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.handleClose(playerIndex)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            );
                        })
                    } {/* End make player deck modals */}
                </MDBContainer>
            </MDBContainer>
        );
    }
}

export default SiegeDeckPills;