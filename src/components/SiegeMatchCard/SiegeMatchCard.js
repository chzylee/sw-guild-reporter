import React, { Component } from 'react';
import Link from 'next/link';
import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBRow, MDBContainer, MDBCol } from 'mdbreact';
import SWDataUtils from '../../swDataUtils';
import SWDisplayUtils from '../../swDisplayUtils';

import './SiegeMatchCard.css';

class SiegeMatchCard extends Component {
    render() {
        return (
            <MDBCard className="SiegeMatchCard">
                <MDBCardBody>
                    <MDBCardTitle>
                        <Link href={`/siegeMatch/${this.props.siegeMatchData.match_info.siege_id}`}>
                            {SWDisplayUtils.getSiegeDateTitle(this.props.siegeMatchData.siege_id)}
                        </Link>
                    </MDBCardTitle>
                    {
                        SWDataUtils.getSiegeMatchSummary(this.props.siegeMatchData).map((guild) => {
                            return (
                                <MDBContainer className="GuildScoreSummary">
                                    <MDBRow>
                                        <MDBCol>
                                            <MDBCardText className="GuildName">
                                                <strong>{`${guild.name}:`}</strong>
                                            </MDBCardText>
                                        </MDBCol>
                                            <MDBCardText className="ScoreSummary">
                                                {guild.points}, used {SWDisplayUtils.getGuildAttackSummary(guild)} attacks
                                            </MDBCardText>
                                    </MDBRow>
                                </MDBContainer>
                            );
                        })
                    } {/* End render siege match summary for each guild */}
                </MDBCardBody>
            </MDBCard>
        );
    }
}

export default SiegeMatchCard;
