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
        let idString = siegeID.toString();
        // based on deduced format of siege_id numbers
        let year = idString.substring(0, 4);
        let month = this.getMonthName(idString.substring(4, 6));
        let week = idString.substring(7, 8); // no month has double digit number of weeks
        let warNumber = idString.substring(9); // 1 or 2 corresponding whether it is war 1/2 or 2/2 of the 2 weekly wars
        return `${month} ${year}, Week ${week}, War ${warNumber}`; // most players refer to "matches" as wars (following in-game text)
    },

    getSiegeDateLabel(siegeID) {
        let idString = siegeID.toString();
        let year = idString.substring(0, 4);
        let month = idString.substring(4, 6);
        let week = idString.substring(7, 8); // no month has double digit number of weeks
        let warNumber = idString.substring(9);
        return `${month}/${year} week ${week}: ${warNumber}/2`; // most players refer to "matches" as wars (following in-game text)
    },

    getSiegeWeekTitle(week) {
        let weekString = week.toString();
        // week has format yyyymmdd
        let year = weekString.substring(0, 4);
        let month = this.getMonthName(weekString.substring(4, 6));
        let weekNumber = weekString.substring(7); // no month has double digit number of weeks
        return `Wars for Week ${weekNumber} of ${month} ${year}`;
    },

    getGuildSuccessRateLabel(guildBattleLogs) {
        let totalSuccesses = guildBattleLogs.successes.total;
        let totalAttempts = guildBattleLogs.attempts.total;
        let totalRate = (totalSuccesses / totalAttempts).toFixed(4) * 100;
        let totalRateString = totalRate.toString().substring(0,5) + '%'; // format to xx.xx% or 100.0%
        return ` ${totalSuccesses}/${totalAttempts}  (${totalRateString})`; // leading space to separate from preceding text
    },

    getWeekSuccessRateLabel(weekLogList) {
        let totalSuccesses = weekLogList[0].battle_logs.successes.total + weekLogList[1].battle_logs.successes.total;
        let totalAttempts = weekLogList[0].battle_logs.attempts.total + weekLogList[1].battle_logs.attempts.total;
        let totalRate = (totalSuccesses / totalAttempts).toFixed(4) * 100;
        let totalRateString = totalRate.toString().substring(0,5) + '%'; // format to xx.xx% or 100.0%
        return ` ${totalSuccesses}/${totalAttempts}  (${totalRateString})`; // leading space to separate from preceding text
    },

    formatTotalBattles(battleCount) {
        if (battleCount < 10) {
            return ` ${battleCount}`; // ensures proper ordering when sorted as strings in table
        } else {
            return battleCount.toString();
        }
    },

    formatLogType(logType) {
        if (logType == 'attack-logs') {
            return 'Attack';
        } else {
            return 'Defense';
        }
    },

    formatPlayerSuccessRate(successRateDecimal) {
        let successRateString = successRateDecimal.toString();
        // using regex from post here: https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
        var truncatedDecimals = successRateString.match(/^-?\d+(?:\.\d{0,2})?/)[0];
        if (truncatedDecimals) {
            return successRateString.match(/^-?\d+(?:\.\d{0,2})?/g)[0];
        } else {
            return successRateString;
        }
    },
    
    formatRecordDescription(description) {
        // MDBReact DataTable sorts by string, so this works around '10' < '9'
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
        let deckMonstersLabel = `${deckMonsters[0]} (L)`; // first monsters is leader and guaranteed to be at least 1
        // number of monsters can be from 1-3
        for (let monsterIndex = 1; monsterIndex < deckMonsters.length; monsterIndex += 1) {
            deckMonstersLabel += ` ${deckMonsters[monsterIndex]}`;
        }
        return deckMonstersLabel;
    },

    formatDeckSuccessRate(successRateDecimal) {
        return `${(successRateDecimal * 100).toFixed(2)}%`;
    },
}