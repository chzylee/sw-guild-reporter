import React, { Component } from 'react';
import { MDBDataTable, MDBContainer } from 'mdbreact';
import SWDataUtils from '../../swDataUtils';
import SWDisplayUtils from '../../swDisplayUtils';
import './BattleLogTable.css';

class AggregateBattleLogTable extends Component {
    getPlayerLogsForMatch(battleLogs) {
        let playerLogs = {};

        for (const player in battleLogs) {
            // Guild totals set in same section of object as players.
            if (player == 'successes' || player == 'attempts') {
                continue;
            }

            let lossesVsGuild1 = battleLogs[player].attempts.vs_guild_1 - battleLogs[player].successes.vs_guild_1;
            let lossesVsGuild2 = battleLogs[player].attempts.vs_guild_2 - battleLogs[player].successes.vs_guild_2;
            playerLogs[player] = {
                playerName: player,
                recordVsGuild1: `${battleLogs[player].successes.vs_guild_1}-${lossesVsGuild1}`,
                recordVsGuild2: `${battleLogs[player].successes.vs_guild_2}-${lossesVsGuild2}`,
                // Rewrap success counts here because need this to get best performance efficiently.
                successesVsGuild1: battleLogs[player].successes.vs_guild_1,
                successesVsGuild2: battleLogs[player].successes.vs_guild_2,
                totalSuccesses: battleLogs[player].successes.total,
                totalBattles: battleLogs[player].attempts.total,
                successRate: SWDisplayUtils.formatPlayerSuccessRate(battleLogs[player].success_rate)
            };
        }

        return playerLogs;
    }

    mergePlayerLogs(playerLogs1, playerLogs2, matchInfo1, matchInfo2) {
        let totals = [];

        for (const player in playerLogs1) {
            const playerData1 = playerLogs1[player];
            if (playerLogs2[player]) {
                const playerData2 = playerLogs2[player];
                const bestPerformance = SWDataUtils.getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
                const mostSuccesses = SWDataUtils.getHighestSuccessPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
                const totalBattles = playerData1.totalBattles + playerData2.totalBattles;
                const successRate = SWDataUtils.getWeekSuccessRate(playerData1, playerData2);
                const successRateString = SWDisplayUtils.formatPlayerSuccessRate(successRate);
                const performanceRating = SWDataUtils.getPerformanceRating(playerData1, playerData2)
                totals.push({
                    playerName: player,
                    bestPerformance: SWDisplayUtils.formatRecordDescription(bestPerformance),
                    mostSuccesses: SWDisplayUtils.formatRecordDescription(mostSuccesses),
                    totalBattles: SWDisplayUtils.formatTotalBattles(totalBattles),
                    successRate: successRateString,
                    performanceRating: SWDisplayUtils.formatPerformanceRating(performanceRating),
                });
            }
        }

        return totals;
    }

    formatAllLogsForTable(logList) {
        let playerLogs = [];
        let matchInfoList = [];
        for (const matchLog of logList) {
            playerLogs.push(this.getPlayerLogsForMatch(matchLog.battle_logs));
            matchInfoList.push(matchLog.match_info);
        }
        return this.mergePlayerLogs(playerLogs, matchInfoList);
    }

    getTableData(weekLogList) {
        return {
            columns: [
                {
                    label: 'Player Name',
                    field: 'playerName',
                    sort: 'desc',
                    width: 200
                },
                {
                    label: 'Best Performance (W-L)',
                    field: 'bestPerformance',
                    sort: 'desc',
                    width: 100
                },
                {
                    label: 'Most Successes (W-L)',
                    field: 'mostSuccesses',
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
                {
                    label: 'Performance Rating',
                    field: 'performanceRating',
                    sort: 'desc',
                    width: 120
                },
            ],
            rows: this.formatAllLogsForTable(weekLogList)
        }
    }

    render() {
        if (this.props.logs.length >= 2) { // need logs for both wars of the week
            return (
                <MDBContainer fluid className="BattleLogTable">
                    <h2>{SWDisplayUtils.formatLogType(this.props.logs[0].log_type)} Logs</h2>
                    <h4>Total Success Rate:  
                        <span className="numberSpan">
                            {SWDisplayUtils.getTotalSuccessRateLabel(this.props.logs)}
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
                    <div>Need logs for at least 2 wars to show data</div>
                </MDBContainer>
            )
        }
    }
}

export default AggregateBattleLogTable;