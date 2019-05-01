import React, { Component } from 'react';
import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle } from 'mdbreact';
import './SiegeGuildCard.css';

class SiegeGuildCard extends Component {
    render() {
        return (
            // 20000 points is the cap, and there are no ties, so 20000 points indicates winner.
            <MDBCard className={'SiegeGuildCard ' + (this.props.guildInfo.points === 20000 ? 'Winner' : '')}>
                <MDBCardBody>
                    <MDBCardTitle>
                        {this.props.guildInfo.name}
                        {this.props.guildInfo.points === 20000 ? '    👑' : ''}
                    </MDBCardTitle>
                    <MDBCardText>
                        <span className="PointsLabel">{this.props.guildInfo.points} points    </span>
                        <span className="PointsPerMinLabel">(+{this.props.guildInfo.points_per_min} pts/min)</span>
                    </MDBCardText>
                    <MDBCardText>
                        <span>Attacks Used: </span>{this.props.guildInfo.attacks_used}<br />
                        <span>Attacks Remaining: </span>{this.props.guildInfo.estimated_attacks_remaining}<br />
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        );
    }
}

export default SiegeGuildCard;
