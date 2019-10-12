module.exports = {
    sendInsertResponse(error, result, dataLabel, logger, res) {
        if (error != null) {
            logger.error(`Error inserting ${dataLabel} data`);
            res.status(500).send({ error: `Error inserting ${dataLabel} data` });
        } else {
            logger.info(`Successfully inserted ${dataLabel} data!`);
            res.send({ result: result });
        }
    },

    sendSimpleQueryResponse(error, result, dataLabel, logger, res) {
        if (error != null) {
            logger.error(`Error finding ${dataLabel} data`);
            res.status(500).send({ error: `Error finding ${dataLabel} data` });
        } else {
            logger.info(`Successfully found ${dataLabel} data!`);
            res.send({ result: result });
        }
    },

    getLimitForCount(count) {
        const countValue = parseInt(count, 10);
        // Fails if count is 'all' or 'recent'.
        if (countValue > 0) {
            return countValue;
        } else if (count == 'all') {
            // MongoDB limit 0 discards limit constraint.
            return 0;
        } else if (count == 'recent') {
            return 5;
        } else {
            // For error checking.
            return -1;
        }
    },

    isValidLogType(logType) {
        return logType == 'attack' || logType == 'defense';
    },

    formatLogType(logType) {
        // Match api param style to field in document.
        return `${logType}-logs`;
    },

    isValidSiegeList(siegeList) {
        if (siegeList.length < 1 || siegeList.length > 6) {
            return false;
        }
        for (const siegeID of siegeList) {
            if (isNaN(siegeID)) {
                return false;
            }
        }
        return true;
    },

    isValidWeek(week) {
        // Week format should be yyyymmww (e.g. 20190402).
        const monthNumber = parseInt(week.substring(4,6), 10);
        if (monthNumber > 12 || monthNumber < 0) {
            return false;
        }
        const weekNumber = parseInt(week.substring(7, 8), 10);
        // Siege matches start monday and thursday, so a month cannot have more than 5 weeks counted.
        if (week.substring(6,7) != '0' || weekNumber > 5) {
            return false;
        }
        const yearNumber = parseInt(week.substring(0,4));
        return yearNumber > 2016; // Siege was released in 2017.
    },

    isValidMatch(siegeID) {
        const matchNumber = parseInt(siegeID.substring(8,10), 10);
        console.log(matchNumber);
        return this.isValidWeek(siegeID) && (matchNumber === 2 || matchNumber === 1);
    },

    formatSiegeList(siegeList) {
        let formattedList = [];
        // Format list of siegeIDs naturally received as strings to numbers.
        for (const siegeID of siegeList) {
            formattedList.push(parseInt(siegeID, 10));
        }
        return formattedList;
    },

    getSiegeListConditions(siegeList) {
        let conditions = [];
        for (const siegeID of siegeList) {
            conditions.push({ siege_id: siegeID });
        }
        return conditions;
    }
}