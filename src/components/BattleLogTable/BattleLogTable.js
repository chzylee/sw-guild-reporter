import React, { Component } from 'react';
import { MDBDataTable, MDBContainer } from 'mdbreact';
import DisplayFormatter from '../..//displayFormatter';
import './BattleLogTable.css';

class BattleLogTable extends Component {
    formatLogsForTable(logData) {
        let battleLogs = logData.battle_logs;
        let tableRows = [];

        for (const player in battleLogs) {
            // Guild totals set in same section of object as players.
            if (player == 'successes' || player == 'attempts') {
                continue;
            }
            let lossesVsGuild1 = battleLogs[player].attempts.vs_guild_1 - battleLogs[player].successes.vs_guild_1;
            let lossesVsGuild2 = battleLogs[player].attempts.vs_guild_2 - battleLogs[player].successes.vs_guild_2;
            if (logData.log_type == 'attack-logs') {
                tableRows.push({
                    playerName: player,
                    recordVsGuild1: DisplayFormatter.formatRecordDescription(`${battleLogs[player].successes.vs_guild_1}-${lossesVsGuild1}`),
                    recordVsGuild2: DisplayFormatter.formatRecordDescription(`${battleLogs[player].successes.vs_guild_2}-${lossesVsGuild2}`),
                    totalBattles: DisplayFormatter.formatTotalBattles(battleLogs[player].attempts.total),
                    successRate: DisplayFormatter.formatPlayerSuccessRate(battleLogs[player].success_rate)
                });
            } else {
                tableRows.push({
                    playerName: player,
                    recordVsGuild1: DisplayFormatter.formatRecordDescription(`${battleLogs[player].successes.vs_guild_1}-${lossesVsGuild1}`),
                    recordVsGuild2: DisplayFormatter.formatRecordDescription(`${battleLogs[player].successes.vs_guild_2}-${lossesVsGuild2}`),
                    totalPlacements: DisplayFormatter.formatTotalBattles(lossesVsGuild1 + lossesVsGuild2),
                    successRate: DisplayFormatter.formatPlayerSuccessRate(battleLogs[player].success_rate)
                });
            }
        }

        return tableRows;
    }

    getTableData(logData) {
        let totalsLabel = DisplayFormatter.getTotalAttemptsLabel(logData.log_type);
        let totalsField = DisplayFormatter.getTotalAttemptsField(logData.log_type);
        return {
            columns: [
                {
                    label: 'Player Name',
                    field: 'playerName',
                    sort: 'desc',
                    width: 200
                },
                {
                    label: `W-L vs ${logData.match_info.opposing_guild_1}`,
                    field: 'recordVsGuild1',
                    sort: 'desc',
                    width: 100
                },
                {
                    label: `W-L vs ${logData.match_info.opposing_guild_2}`,
                    field: 'recordVsGuild2',
                    sort: 'desc',
                    width: 100
                },
                {
                    label: totalsLabel,
                    field: totalsField,
                    sort: 'desc',
                    width: 80
                },
                {
                    label: 'Success Rate',
                    field: 'successRate',
                    sort: 'desc',
                    width: 120
                },
            ],
            rows: this.formatLogsForTable(logData)
        };
    }

    showPlacementsNote(logType) {
        if (logType == 'defense-logs') {
            return (<p>* Total Placements does not include placements of defenses on towers that remained standing at the end of the war.</p>);
        }
    }

    render() {
        // Checking match_info ensures whole object is set.
        if (this.props.logs.match_info) {
            return (
                <MDBContainer fluid className="BattleLogTable">
                    <h2>{DisplayFormatter.formatLogType(this.props.logs.log_type)} Logs</h2>
                    <h4>Total Success Rate:  
                        <span className="numberSpan">
                            {DisplayFormatter.getGuildSuccessRateLabel(this.props.logs.battle_logs)}
                        </span>
                    </h4>
                    { this.showPlacementsNote(this.props.logs.log_type) }
                    <MDBDataTable 
                        striped
                        hover
                        dark
                        data={this.getTableData(this.props.logs)}
                        className="LogDataTable"
                    />
                </MDBContainer>
            )
        } else {
            return (
                <MDBContainer>
                    <div>No logs found</div>
                </MDBContainer>
            )
        }
    }
}

export default BattleLogTable;