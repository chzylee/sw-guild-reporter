import React, { Component } from 'react';
import { MDBCol, MDBContainer, MDBRow } from 'mdbreact';
import SiegeGuildCard from '../SiegeGuildCard/SiegeGuildCard';
import './SiegeMatchHeader.css';

class SiegeMatchHeader extends Component {
    render() {
        return (
            <MDBContainer fluid className="SiegeMatchHeader">
                <MDBRow>
                    <MDBCol>
                        <SiegeGuildCard guildInfo={this.props.guildList[0]}/>
                    </MDBCol>
                    <MDBCol>
                        <SiegeGuildCard guildInfo={this.props.guildList[1]}/>
                    </MDBCol>
                    <MDBCol>
                        <SiegeGuildCard guildInfo={this.props.guildList[2]}/>
                    </MDBCol>
                </MDBRow> {/* End row of guild cards */}
            </MDBContainer>
        );
    }
}

export default SiegeMatchHeader;
