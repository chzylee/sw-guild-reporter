module.exports = {
    sendInsertResponse(error, result, dataLabel, logger, res) {
        if (error != null) {
            logger.error(`Error inserting ${dataLabel} data`);
            res.status(500).send({ error: `Error inserting ${dataLabel} data` });
        } else {
            logger.trace(`Successfully inserted ${dataLabel} data!`);
            res.send({ result: result });
        }
    },

    sendSimpleQueryResponse(error, result, dataLabel, logger, res) {
        if (error != null) {
            logger.error(`Error finding ${dataLabel} data`);
            res.status(500).send({ error: `Error finding ${dataLabel} data` });
        } else {
            logger.trace(`Successfully found ${dataLabel} data!`);
            res.send({ result: result });
        }
    },

    getLimitForCount(count) {
        const countValue = parseInt(count, 10);
        if (countValue > 0) { // fails if count is 'all' or 'recent'
            return countValue;
        } else if (count == 'all') { // mongoDB limit 0 discards limit constraint
            return 0;
        } else if (count == 'recent') {
            return 5;
        } else {
            return -1;// for error checking
        }
    },

    isValidLogType(logType) {
        return logType == 'attack' || logType == 'defense';
    },

    formatLogType(logType) {
        return `${logType}-logs`; // match api param style to field in document
    },

    isValidWeek(week) {
        // week format should be yyyymmww (e.g. 20190402)
        const monthNumber = parseInt(week.substring(4,6), 10);
        if (monthNumber > 12 || monthNumber < 0) {
            return false;
        }
        const weekNumber = parseInt(week.substring(7), 10);
        // siege matches start monday and thursday, so a month cannot have more than 5 weeks counted
        if (week.substring(6,7) != '0' || weekNumber > 5) {
            return false;
        }
        const yearNumber = parseInt(week.substring(0,4));
        return yearNumber > 2016; // siege was released in 2017
    }
}