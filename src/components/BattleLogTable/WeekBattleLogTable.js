import React, { Component } from 'react';
import { MDBDataTable, MDBContainer } from 'mdbreact';
import SWDataUtils from '../../swDataUtils';
import SWDisplayUtils from '../../swDisplayUtils';
import './BattleLogTable.css';

class WeekBattleLogTable extends Component {
    getPlayerLogsForMatch(battleLogs) {
        let playerLogs = {};

        for (const player in battleLogs) {
            // guild totals set in same section of object as players
            if (player == 'successes' || player == 'attempts') {
                continue;
            }

            let lossesVsGuild1 = battleLogs[player].attempts.vs_guild_1 - battleLogs[player].successes.vs_guild_1;
            let lossesVsGuild2 = battleLogs[player].attempts.vs_guild_2 - battleLogs[player].successes.vs_guild_2;
            playerLogs[player] = {
                recordVsGuild1: `${battleLogs[player].successes.vs_guild_1}-${lossesVsGuild1}`,
                recordVsGuild2: `${battleLogs[player].successes.vs_guild_2}-${lossesVsGuild2}`,
                // rewrap success counts here because need this to get best performance efficiently
                successesVsGuild1: battleLogs[player].successes.vs_guild_1,
                successesVsGuild2: battleLogs[player].successes.vs_guild_2,
                totalSuccesses: battleLogs[player].successes.total,
                totalBattles: battleLogs[player].attempts.total,
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

    formatWeekLogsForTable(weekLogList) {
        const log1 = weekLogList[0];
        const log2 = weekLogList[1];
        const battleLogs1 = log1.battle_logs;
        const battleLogs2 = log2.battle_logs;
        let playerLogs1 = this.getPlayerLogsForMatch(battleLogs1);
        let playerLogs2 = this.getPlayerLogsForMatch(battleLogs2);
        return this.mergePlayerLogs(playerLogs1, playerLogs2, log1.match_info, log2.match_info);
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
            rows: this.formatWeekLogsForTable(weekLogList)
        }
    }

    render() {
        if (this.props.logs.length == 2) { // need logs for both wars of the week
            return (
                <MDBContainer fluid className="BattleLogTable">
                    <h2>{SWDisplayUtils.formatLogType(this.props.logs[0].log_type)} Logs</h2>
                    <h4>Total Success Rate:  
                        <span className="numberSpan">
                            {SWDisplayUtils.getWeekSuccessRateLabel(this.props.logs)}
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
                    <div>Need logs for 2 wars to show data</div>
                </MDBContainer>
            )
        }
    }
}

export default WeekBattleLogTable;