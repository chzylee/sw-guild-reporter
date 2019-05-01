import React, { Component } from 'react';
import { MDBDataTable, MDBContainer } from 'mdbreact';
import SWDisplayUtils from '../../swDisplayUtils';
import './BattleLogTable.css';

class BattleLogTable extends Component {
    formatLogsForTable(battleLogs) {
        let tableRows = [];

        for (const player in battleLogs) {
            // guild totals set in same section of object as players
            if (player == 'successes' || player == 'attempts') {
                continue;
            }
            let lossesVsGuild1 = battleLogs[player].attempts.vs_guild_1 - battleLogs[player].successes.vs_guild_1;
            let lossesVsGuild2 = battleLogs[player].attempts.vs_guild_2 - battleLogs[player].successes.vs_guild_2;
            tableRows.push({
                playerName: player,
                recordVsGuild1: SWDisplayUtils.formatRecordDescription(`${battleLogs[player].successes.vs_guild_1}-${lossesVsGuild1}`),
                recordVsGuild2: SWDisplayUtils.formatRecordDescription(`${battleLogs[player].successes.vs_guild_2}-${lossesVsGuild2}`),
                totalBattles: SWDisplayUtils.formatTotalBattles(battleLogs[player].attempts.total),
                successRate: SWDisplayUtils.formatPlayerSuccessRate(battleLogs[player].success_rate)
            });
        }

        return tableRows;
    }

    getTableData(logData) {
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
                    label: 'Total Battles',
                    field: 'totalBattles',
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
            rows: this.formatLogsForTable(logData.battle_logs)
        }
    }

    render() {
        if (this.props.logs.match_info) { // checking match_info ensures whole obbject is set
            return (
                <MDBContainer fluid className="BattleLogTable">
                    <h2>{SWDisplayUtils.formatLogType(this.props.logs.log_type)} Logs</h2>
                    <h4>Total Success Rate:  
                        <span className="numberSpan">
                            {SWDisplayUtils.getGuildSuccessRateLabel(this.props.logs.battle_logs)}
                        </span>
                    </h4>
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