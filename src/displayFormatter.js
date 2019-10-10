module.exports = {
    getMonthName(monthNumString) {
        switch (monthNumString) {
            case '01': return 'January'
            case '02': return 'February'
            case '03': return 'March'
            case '04': return 'April'
            case '05': return 'May'
            case '06': return 'June'
            case '07': return 'July'
            case '08': return 'August'
            case '09': return 'September'
            case '10': return 'October'
            case '11': return 'November'
            case '12': return 'December'
            default : return 'Invalid month string'
        }
    },

    getSiegeDateTitle(siegeID) {
        if (typeof(siegeID) !== 'number') {
            return 'Invalid siege ID';
        }
        try {
            let idString = siegeID.toString();
            // Based on deduced format of siege_id numbers.
            let year = idString.substring(0, 4);
            let month = this.getMonthName(idString.substring(4, 6));
            // No month has double digit number of weeks.
            let week = idString.substring(7, 8);
            // 1 or 2 corresponding whether it is war 1/2 or 2/2 of the 2 weekly wars.
            let warNumber = idString.substring(9);
            // Most players refer to "matches" as wars (following in-game text).
            return `${month} ${year}, Week ${week}, War ${warNumber}`;
        }
        catch (e) {
            return 'Invalid siege ID';
        }
    },

    getSiegeDateLabel(siegeID) {
        if (typeof(siegeID) !== 'number') {
            return 'Invalid siege ID';
        }
        try {
            let idString = siegeID.toString();
            let year = idString.substring(0, 4);
            let month = idString.substring(4, 6);
            // No month has double digit number of weeks.
            let week = idString.substring(7, 8);
            let warNumber = idString.substring(9);
            // Most players refer to "matches" as wars (following in-game text).
            return `${month}/${year} week ${week}: ${warNumber}/2`;
        }
        catch (e) {
            return 'Invalid siege ID';
        }
    },

    getGuildSuccessRateLabel(guildBattleLogs) {
        let totalSuccesses = guildBattleLogs.successes.total;
        let totalAttempts = guildBattleLogs.attempts.total;
        let totalRate = (totalSuccesses / totalAttempts).toFixed(4) * 100;
        // Format to xx.xx% or 100.0%.
        let totalRateString = totalRate.toString().substring(0,5) + '%';
        // Leading space to separate from preceding text.
        return ` ${totalSuccesses}/${totalAttempts}  (${totalRateString})`;
    },

    getTotalSuccessRateLabel(logList) {
        let totalSuccesses = logList[0].battle_logs.successes.total + logList[1].battle_logs.successes.total;
        let totalAttempts = logList[0].battle_logs.attempts.total + logList[1].battle_logs.attempts.total;
        let totalRate = (totalSuccesses / totalAttempts).toFixed(4) * 100;
        // Format to xx.xx% or 100.0%.
        let totalRateString = totalRate.toString().substring(0,5) + '%';
        // Leading space to separate from preceding text.
        return ` ${totalSuccesses}/${totalAttempts}  (${totalRateString})`;
    },

    formatTotalBattles(battleCount) {
        if (battleCount < 10) {
            // Ensures proper ordering when sorted as strings in table.
            return ` ${battleCount}`;
        } else {
            return battleCount.toString();
        }
    },

    formatLogType(logType) {
        if (logType == 'attack-logs') {
            return 'Attack';
        } else if (logType == 'defense-logs') {
            return 'Defense';
        }
        else {
            return 'Invalid log type';
        }
    },

    getTotalAttemptsLabel(logType) {
        if (logType == 'attack-logs') {
            return 'Total Battles';
        } else if (logType == 'defense-logs') {
            return 'Total Placements';
        }
        else {
            return 'Invalid log type';
        }
    },

    getTotalAttemptsField(logType) {
        if (logType == 'attack-logs') {
            return 'totalBattles';
        } else if (logType == 'defense-logs') {
            return 'totalPlacements';
        }
        else {
            return 'invalidLogType';
        }
    },

    formatPlayerSuccessRate(successRateDecimal) {
        let successRateString = successRateDecimal.toString();
        // Using regex from post here: https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
        var truncatedDecimals = successRateString.match(/^-?\d+(?:\.\d{0,2})?/)[0];
        if (truncatedDecimals) {
            return successRateString.match(/^-?\d+(?:\.\d{0,2})?/g)[0];
        } else {
            return successRateString;
        }
    },
    
    formatRecordDescription(description) {
        // MDBReact DataTable sorts by string, so this works around '10' < '9'.
        return description.replace('10-0', 'Perfect 10-0');
    },

    formatPerformanceRating(performanceRating) {
        if (performanceRating.length < 4) {
            return ` ${performanceRating}`;
        } else {
            return performanceRating;
        }
    },

    getSiegeMatchTitle(siegeMatchData) {
        let siegeIDString = siegeMatchData.match_info.siege_id.toString();
        return siegeIDString.endsWith('01') ? 'Monday-Tuesday War' : 'Thursday-Friday War';
    },

    getGuildAttackSummary(guildData) {
        let totalAttacks = guildData.registered_attackers * 10;
        return `${guildData.attacks_used}/${totalAttacks}`;
    },

    formatSiegeDeckMonsters(deckMonsters) {
        // First monsters is leader and guaranteed to be at least 1.
        let deckMonstersLabel = `${deckMonsters[0]} (L)`;
        // Number of monsters can be from 1-3.
        for (let monsterIndex = 1; monsterIndex < deckMonsters.length; monsterIndex += 1) {
            deckMonstersLabel += ` ${deckMonsters[monsterIndex]}`;
        }
        return deckMonstersLabel;
    },

    formatDeckSuccessRate(successRateDecimal) {
        return `${(successRateDecimal * 100).toFixed(2)}%`;
    },
}