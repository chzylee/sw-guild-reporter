module.exports = {

    // Computation functions
    getSuccessRateFromRecord(record) {
        // Based on format of records stored for players in this.getPlayerDataForWar.
        const recordNumbers = record.split('-');
        // Avoid divide by 0 if player did not hit a certain guild.
        if (recordNumbers[0] == '0' && recordNumbers[1] == '0') {
            return 0;
        }
        const successes = parseInt(recordNumbers[0], 10);
        const losses = parseInt(recordNumbers[1], 10);
        // May round to 0 if not normalized to 0-100% value.
        return (successes / (successes + losses)).toFixed(4) * 100;
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

    // Greedy alg for index of best success count.
    getHigherSuccessCount(ties, successCounts) {
        let bestIndex = ties[0];
        for (let tieIndex of ties) {
            if (successCounts[tieIndex] > successCounts[bestIndex]) {
                bestIndex = tieIndex;
            }
        }
        return bestIndex;
    },

    // PlayerData 1/2 corresponds to data for same player for 2 wars.
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
            // Break tie with highest success count.
            let bestCountIndex = this.getHigherSuccessCount(ties, successCounts);
            // Rates normalized to 100 to prevent rounding to 0, so this ensures correct winner
            successRates[bestCountIndex] += 100;
            bestRate += 100;
        }
        // Need to check each individually to properly display opposing guild.
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
        // No need to break tie here because we only care about highest win count.
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
        // Total rates left in decimal form for table sorting.
        return (totalSuccesses / totalBattles).toFixed(4);
    },

    getPerformanceRating(playerData1, playerData2) {
        const totalBattles = playerData1.totalBattles + playerData2.totalBattles;
        const weekSuccessRate = parseFloat(this.getWeekSuccessRate(playerData1, playerData2));
        const performanceRating = (totalBattles * weekSuccessRate) * 100;
        return performanceRating.toFixed(0);
    }
}