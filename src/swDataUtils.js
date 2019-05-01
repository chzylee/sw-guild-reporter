const _ = require('lodash');
const SWDisplayUtils = require('./swDisplayUtils');

module.exports = {

    // Computation functions
    getSuccessRateFromRecord(record) {
        // based on format of records stored for players in this.getPlayerDataForWar
        const recordNumbers = record.split('-');
        // avoid divide by 0 if player did not hit a certain guild
        if (recordNumbers[0] == '0' && recordNumbers[1] == '0') {
            return 0;
        }
        const successes = parseInt(recordNumbers[0], 10);
        const losses = parseInt(recordNumbers[1], 10);
        return (successes / (successes + losses)).toFixed(4) * 100; // may round to 0 if not normalized to 0-100% value 
    },

    getTiesForBest(successRates, bestRate) {
        let tiesForBest = [];
        for (const rateIndex in successRates) {
            if (successRates[rateIndex] === bestRate) {
                tiesForBest.push(rateIndex);
            }
        }
        return tiesForBest;
    },

    // greedy alg for index of best success count
    getHigherSuccessCount(ties, successCounts) {
        let bestIndex = ties[0];
        for (let tieIndex of ties) {
            if (successCounts[tieIndex] > successCounts[bestIndex]) {
                bestIndex = tieIndex;
            }
        }
        return bestIndex;
    },

    getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2) {
        let successRates = [
            this.getSuccessRateFromRecord(playerData1.recordVsGuild1),
            this.getSuccessRateFromRecord(playerData1.recordVsGuild2),
            this.getSuccessRateFromRecord(playerData2.recordVsGuild1),
            this.getSuccessRateFromRecord(playerData2.recordVsGuild2),
        ];
        let successCounts = [
            playerData1.successesVsGuild1,
            playerData1.successesVsGuild2,
            playerData2.successesVsGuild1,
            playerData2.successesVsGuild2,
        ];
        let bestRate = Math.max(...successRates);
        let ties = this.getTiesForBest(successRates, bestRate);
        if (ties.length > 1) {
            let bestCountIndex = this.getHigherSuccessCount(ties, successCounts); // break tie with highest success count
            // rates normalized to 100 to prevent rounding to 0, so this ensures correct winner
            successRates[bestCountIndex] += 100;
            bestRate += 100;
        }
        let description = '';
        // need to check each individually to properly display opposing guild
        if (bestRate == successRates[0]) {
            return `${playerData1.recordVsGuild1} vs. ${matchInfo1.opposing_guild_1}`;
        } else if (bestRate == successRates[1]) {
            return `${playerData1.recordVsGuild2} vs. ${matchInfo1.opposing_guild_2}`;
        } else if (bestRate == successRates[2]) {
            return `${playerData2.recordVsGuild1} vs. ${matchInfo2.opposing_guild_1}`;
        } else if (bestRate == successRates[3]) {
            return `${playerData2.recordVsGuild2} vs. ${matchInfo2.opposing_guild_2}`;
        } else {
            return `- no best performance -`;
        }
    },

    getHighestSuccessPerformance(playerData1, playerData2, matchInfo1, matchInfo2) {
        let successCounts = [
            playerData1.successesVsGuild1,
            playerData1.successesVsGuild2,
            playerData2.successesVsGuild1,
            playerData2.successesVsGuild2,
        ];

        let maxSuccesses = Math.max(...successCounts);
        // no need to break tie here because we only care about highest win count
        if (maxSuccesses == successCounts[0]) {
            return `${playerData1.recordVsGuild1} vs. ${matchInfo1.opposing_guild_1}`;
        } else if (maxSuccesses == successCounts[1]) {
            return `${playerData1.recordVsGuild2} vs. ${matchInfo1.opposing_guild_2}`;
        } else if (maxSuccesses == successCounts[2]) {
            return `${playerData2.recordVsGuild1} vs. ${matchInfo2.opposing_guild_1}`;
        } else if (maxSuccesses == successCounts[3]) {
            return `${playerData2.recordVsGuild2} vs. ${matchInfo2.opposing_guild_2}`;
        } else {
            return `- no max success count -`;
        }
    },

    getWeekSuccessRate(playerData1, playerData2) {
        const totalSuccesses = playerData1.totalSuccesses + playerData2.totalSuccesses;
        const totalBattles = playerData1.totalBattles + playerData2.totalBattles;
        return (totalSuccesses / totalBattles).toFixed(4); // total rates left in decimal form for table sorting
    },

    getPerformanceRating(playerData1, playerData2) {
        const totalBattles = playerData1.totalBattles + playerData2.totalBattles;
        const weekSuccessRate = parseFloat(this.getWeekSuccessRate(playerData1, playerData2));
        const performanceRating = (totalBattles * weekSuccessRate) * 100;
        return performanceRating.toFixed(0);
    },

    filterWeeks(siegeMatchList) {
        let truncatedIDs = siegeMatchList.map((siegeMatch) => {
            let idString = siegeMatch.siege_id.toString();
            let weekString = idString.substring(0,8); // first 8 chars of siegeID correspond to yyyymmww
            return weekString;
        });
        return _.uniq(truncatedIDs); // returns only uniq weeks
    },

    getSiegeMatchSummary(siegeMatchData) {
        return siegeMatchData.guild_list.sort((guild1, guild2) => {
            return guild1.points < guild2.points; // sort in descending order
        });
    },

    getUniqueComps(siegeDecks) {
        let allComps = [];
        for (const player of siegeDecks) {
            for (const deck of player.defenses) {
                let deckMonsters = SWDisplayUtils.formatSiegeDeckMonsters(deck.monsters);
                let comp = allComps.find((comp) => {
                    return comp.monsters == deckMonsters;
                });
                if (comp === undefined) {
                    allComps.push({
                        leader: deck.monsters[1],
                        monsters: deckMonsters,
                        successes: deck.successes,
                        fails: deck.fails,
                        total: deck.total,
                    });
                } else {
                    comp.successes += deck.successes;
                    comp.fails += deck.fails;
                    comp.total += deck.total;
                }
            }
        }

        return allComps.sort((comp1, comp2) => {
            return comp1.monsters > comp2.monsters;
        });
    }
}