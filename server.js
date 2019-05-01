const express = require('express');
const next = require('next');
const log4js = require('log4js');
const DBClient = require('./src/dbClient').DBClient;
const ServerUtils = require('./src/serverUtils');

const logger = log4js.getLogger();
log4js.configure({
    appenders: { 
        logfile: { type: 'file', filename: 'server.log' },
        out: { type: 'stdout' },
    },
    categories: { 
        default: { appenders: ['logfile', 'out'], level: 'all' }
    }
});

// starter server vars from (https://medium.com/@mandra.jakub/materialize-your-next-js-project-with-mdbootstrap-for-react-4301d40737d9)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// end starter server vars

// Connection URL
let dbClient = new DBClient();

app.prepare().then(() => {
    logger.trace('Starting server...');
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded());

    // Siege Match database endpoints
    server.post('/db/siegeMatches', (req, res) => {
        logger.trace('Received siege match data');
        dbClient.updateDataInCollection({ "siege_id": req.body.match_info.siege_id }, req.body, 'siegeMatches', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/db/siegeMatches', (req, res) => {
        logger.trace('Received request for siege match data');
        dbClient.showDataInCollection('siegeMatches', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/db/siegeMatches/latest', (req, res) => {
        logger.trace('Received request for latest siege match data');
        dbClient.getMostRecentSiegeMatch((error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/db/siegeMatches/id/list/:count', (req, res) => {
        logger.trace(`Received request for ${req.params.count} siege match IDs`);
        const limit = ServerUtils.getLimitForCount(req.params.count);
        if (limit < 0) {
            logger.warn('Received invalid count');
            res.status(400).send({ error: 'Given count needs to be \'all\', \'recent\', or a positive number' });
            return;
        } else {
            logger.debug(`Querying siegeMatches for ${limit} recent ids`);
            dbClient.getSiegeMatchIDs(limit, (error, result) => {
                if (error != null) {
                    logger.error('Error finding siege match IDs');
                    res.status(500).send({ error: 'Error finding siege match IDs' });
                }
                logger.trace('Successfully found siege match IDs!');
                res.send({ result: result });
            });
        }
    });

    server.get('/db/siegeMatches/id/:siegeID', (req, res) => {
        logger.trace(`Received request for siege match data`);
        const siegeID = parseInt(req.params.siegeID, 10); // params stored as strings
        if (isNaN(siegeID)) {
            logger.warn('Received NaN siegeID');
            res.status(400).send({ error: 'Given siegeID needs to be the numeric ID' });
        } else {
            logger.debug(`Querying siegeMatches for match with siege_id ${siegeID}`);
            dbClient.findDataInCollection({ siege_id: siegeID }, 'siegeMatches', (error, result) => {
                if (error != null || result[0] == undefined) {
                    logger.error(`Error finding siege match with siege_id ${siegeID}`);
                    res.status(500).send({ error: `Error finding siege match with siege_id ${siegeID}` });
                }
                logger.trace(`Successfully found siege match with siege_id ${siegeID}!`);
                res.send({ result: result[0] });
            });
        }
    });

    server.get('/db/siegeMatches/week/:week', (req, res) => {
        logger.trace(`Received request for siege match data from week ${req.params.week}`);
        if (!ServerUtils.isValidWeek(req.params.week)) {
            logger.warn('Received invalid week parameter');
            res.status(400).send({ error: 'Given week needs to have format yyyymmww (e.g. 20190402 for 2019 April week 2)' });
            return;
        } else {
            const idPrefixForWeek = req.params.week; // week format matches first part of siege_id provided by game
            const idWeek1 = parseInt(idPrefixForWeek + '01', 10); // ids stored as ints
            const idWeek2 = parseInt(idPrefixForWeek + '02', 10);
            logger.debug(`Querying siege match data for matches with siege_ids ${idWeek1}, ${idWeek2}`);
            dbClient.findDataInCollection({ 
                $or: [ { siege_id: idWeek1 }, { siege_id: idWeek2 } ] 
            }, 'siegeMatches', (error, result) => {
                if (error != null || result.length < 2) {
                    logger.error(`Error finding battle log data for two matches in week ${idPrefixForWeek}`);
                    res.status(500).send({ error: `Error finding battle log data for two matches in week ${idPrefixForWeek}` });
                } else {
                    logger.trace(`Successfully found battle log data for matches in week ${idPrefixForWeek}!`);
                    res.send({ 
                        week: idPrefixForWeek,
                        result: result 
                    });
                }
            });
        }
    });

    // Battle Log database endpoints
    server.post('/db/battleLogs', (req, res) => {
        logger.trace('Received battle log data');
        dbClient.updateDataInCollection({ "siege_id": req.body.match_info.siege_id, "log_type": req.body.log_type }, req.body, 'battleLogs', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'battle log', logger, res);
        });
    });

    server.get('/db/battleLogs', (req, res) => {
        logger.trace('Received request for battle log data');
        dbClient.showDataInCollection('battleLogs', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'battle log', logger, res);
        });
    });

    server.get('/db/battleLogs/:logType/latest', (req, res) => {
        logger.trace('Received request for latest battle log data');
        const logType = req.params.logType;
        if (!ServerUtils.isValidLogType(logType)) {
            logger.warn('Received invalid battle log type');
            res.status(400).send({ error: 'Given logType needs to be either \'attack\' or \'defense\'' });
            return;
        } else {
            dbClient.getMostRecentBattleLogs(`${logType}-logs`, (error, result) => {
                ServerUtils.sendSimpleQueryResponse(error, result, 'battle log', logger, res);
            });
        }
    });

    server.get('/db/battleLogs/:logType/id/:siegeID', (req, res) => {
        logger.trace('Received request for latest battle log data');
        if (!ServerUtils.isValidLogType(req.params.logType)) {
            logger.warn('Received invalid battle log type');
            res.status(400).send({ error: 'Given logType needs to be either \'attack\' or \'defense\'' });
            return;
        } else {
            const logType = ServerUtils.formatLogType(req.params.logType);
            const siegeID = parseInt(req.params.siegeID, 10); // params stored as strings
            logger.debug(`Querying battleLogs for ${logType} log with siege_id ${siegeID}`);
            dbClient.findDataInCollection({ log_type: logType, siege_id: siegeID }, 'battleLogs', (error, result) => {
                if (error != null || result[0] == undefined) {
                    logger.error(`Error finding battle log data for match with siege_id ${siegeID}`);
                    res.status(500).send({ error: `Error finding battle log data for match with siege_id ${siegeID}` });
                } else {
                    logger.trace(`Successfully found battle log data for match with siege_id ${siegeID}!`);
                    res.send({ result: result[0] });
                }
            });
        }
    });

    server.get('/db/battleLogs/:logType/week/:week', (req, res) => {
        logger.trace(`Received request for battle log data from week ${req.params.week}`);
        if (!ServerUtils.isValidWeek(req.params.week)) {
            logger.warn('Received invalid week parameter');
            res.status(400).send({ error: 'Given week needs to have format yyyymmww (e.g. 20190402 for 2019 April week 2)' });
            return;
        } else {
            const logType = ServerUtils.formatLogType(req.params.logType);
            const idPrefixForWeek = req.params.week; // week format matches first part of siege_id provided by game
            const idWeek1 = parseInt(idPrefixForWeek + '01', 10); // ids stored as ints
            const idWeek2 = parseInt(idPrefixForWeek + '02', 10);
            logger.debug(`Querying ${logType} for matches with siege_ids ${idWeek1}, ${idWeek2}`);
            dbClient.findDataInCollection({ 
                log_type: logType, 
                $or: [ { siege_id: idWeek1 }, { siege_id: idWeek2 } ] 
            }, 'battleLogs', (error, result) => {
                if (error != null || result.length < 2) {
                    logger.error(`Error finding battle log data for two matches in week ${idPrefixForWeek}`);
                    res.status(500).send({ error: `Error finding battle log data for two matches in week ${idPrefixForWeek}` });
                } else {
                    logger.trace(`Successfully found battle log data for matches in week ${idPrefixForWeek}!`);
                    res.send({ 
                        week: idPrefixForWeek,
                        result: result 
                    });
                }
            });
        }
    });

    // Siege Deck database endpoints
    server.post('/db/siegeDecks', (req, res) => {
        logger.trace('Received siege deck data');
        dbClient.updateDataInCollection({ "player_id": req.body.player_id }, req.body, 'siegeDecks', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'siege deck', logger, res);
        });
    });

    server.get('/db/siegeDecks', (req, res) => {
        logger.trace('Received request for siege deck data');
        dbClient.showDataInCollection('siegeDecks', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege deck', logger, res);
        });
    });

    // Webpage endpoints
    server.get('/weekSummary/:siegeWeekID', (req, res) => {
        logger.info(`Received get request to /weekSummary/${req.params.siegeWeekID}`);
        return app.render(req, res, '/weekSummary', { siegeWeekID: req.params.siegeWeekID });
    });

    server.get('/siegeMatch/:siegeMatchID', (req, res) => {
        logger.info(`Received get request to /${req.params.siegeMatchID}`);
        return app.render(req, res, '/index', { siegeMatchID: req.params.siegeMatchID });
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (error) => {
        if (error) {
            throw error;
        }
        logger.info('> Ready on http://localhost:3000');
    });
}) // end app.prepare().then()
.catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
});