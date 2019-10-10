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

// Starter server vars from (https://medium.com/@mandra.jakub/materialize-your-next-js-project-with-mdbootstrap-for-react-4301d40737d9)
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
    server.post('/api/:guildName/siegeMatches', (req, res) => {
        logger.info('Received siege match data');
        dbClient.updateDataInCollection({ 
            guild_name: req.params.guildName, 
            siege_id: req.body.match_info.siege_id 
        }, req.body, 'siegeMatches', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/api/:guildName/siegeMatches', (req, res) => {
        logger.info('Received request for siege match data');
        dbClient.showDataInCollection(req.params.guildName, 'siegeMatches', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/api/:guildName/siegeMatches/latest', (req, res) => {
        logger.info('Received request for latest siege match data');
        dbClient.getMostRecentSiegeMatch(req.params.guildName, (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege match', logger, res);
        });
    });

    server.get('/api/:guildName/siegeMatches/id/list/:count', (req, res) => {
        logger.info(`Received request for ${req.params.count} siege match IDs`);
        const limit = ServerUtils.getLimitForCount(req.params.count);
        if (limit < 0) {
            logger.warn('Received invalid count');
            res.status(400).send({ error: 'Given count needs to be \'all\', \'recent\', or a positive number' });
            return;
        } else {
            logger.debug(`Querying siegeMatches for ${limit} recent ids`);
            dbClient.getSiegeMatchIDs(req.params.guildName, limit, (error, result) => {
                if (error != null) {
                    logger.error('Error finding siege match IDs');
                    res.status(500).send({ error: 'Error finding siege match IDs' });
                } else {
                    logger.info('Successfully found siege match IDs!');
                    res.send({ result: result });
                }
            });
        }
    });

    server.get('/api/:guildName/siegeMatches/id/:siegeID', (req, res) => {
        logger.info(`Received request for siege match data`);
        let siegeList = ServerUtils.formatSiegeList(req.params.siegeID.split('+'));
        if (!ServerUtils.isValidSiegeList(siegeList)) {
            logger.warn('Received NaN siegeID'); // siegeList = list of siegeIDs
            res.status(400).send({ error: 'Given siegeID(s) need to be the numeric IDs separated by a + (e.g. 2019040301+2019040302)' });
        } else {
            logger.debug(`Querying siegeMatches for match with siege_id ${siegeID}`);
            dbClient.findDataInCollection({ guild_name: req.params.guildName, siege_id: siegeID }, 'siegeMatches', (error, result) => {
                if (error != null || result[0] == undefined) {
                    logger.error(`Error finding siege match with siege_id ${siegeID}`);
                    res.status(500).send({ error: `Error finding siege match with siege_id ${siegeID}` });
                }
                logger.info(`Successfully found siege match with siege_id ${siegeID}!`);
                res.send({ result: result[0] });
            });
        }
    });

    server.get('/api/:guildName/siegeMatches/week/:week', (req, res) => {
        logger.info(`Received request for siege match data from week ${req.params.week}`);
        if (!ServerUtils.isValidWeek(req.params.week)) {
            logger.warn('Received invalid week parameter');
            res.status(400).send({ error: 'Given week needs to have format yyyymmww (e.g. 20190402 for 2019 April week 2)' });
            return;
        } else {
            // Week format matches first part of siege_id provided by game.
            const idPrefixForWeek = req.params.week;
            // Ids stored as ints in MongoDB.
            const idWeek1 = parseInt(idPrefixForWeek + '01', 10);
            const idWeek2 = parseInt(idPrefixForWeek + '02', 10);
            logger.debug(`Querying siege match data for matches with siege_ids ${idWeek1}, ${idWeek2}`);
            dbClient.findDataInCollection({ 
                guild_name: req.params.guildName, 
                $or: [ { siege_id: idWeek1 }, { siege_id: idWeek2 } ]
            }, 'siegeMatches', (error, result) => {
                if (error != null || result.length < 2) {
                    logger.error(`Error finding battle log data for two matches in week ${idPrefixForWeek}`);
                    res.status(500).send({ error: `Error finding battle log data for two matches in week ${idPrefixForWeek}` });
                } else {
                    logger.info(`Successfully found battle log data for matches in week ${idPrefixForWeek}!`);
                    res.send({ 
                        week: idPrefixForWeek,
                        result: result 
                    });
                }
            });
        }
    });

    // Battle Log database endpoints
    server.post('/api/:guildName/battleLogs', (req, res) => {
        logger.info('Received battle log data');
        dbClient.updateDataInCollection({ 
            guild_name: req.params.guildName, 
            siege_id: req.body.match_info.siege_id, 
            log_type: req.body.log_type 
        }, req.body, 'battleLogs', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'battle log', logger, res);
        });
    });

    server.get('/api/:guildName/battleLogs', (req, res) => {
        logger.info('Received request for battle log data');
        dbClient.showDataInCollection(req.params.guildName, 'battleLogs', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'battle log', logger, res);
        });
    });

    server.get('/api/:guildName/battleLogs/:logType/latest', (req, res) => {
        logger.info('Received request for latest battle log data');
        const logType = req.params.logType;
        if (!ServerUtils.isValidLogType(logType)) {
            logger.warn('Received invalid battle log type');
            res.status(400).send({ error: 'Given logType needs to be either \'attack\' or \'defense\'' });
            return;
        } else {
            dbClient.getMostRecentBattleLogs(req.params.guildName, `${logType}-logs`, (error, result) => {
                ServerUtils.sendSimpleQueryResponse(error, result, 'battle log', logger, res);
            });
        }
    });

    server.get('/api/:guildName/battleLogs/:logType/id/:siegeID', (req, res) => {
        logger.info('Received request for latest battle log data');
        if (!ServerUtils.isValidLogType(req.params.logType)) {
            logger.warn('Received invalid battle log type');
            res.status(400).send({ error: 'Given logType needs to be either \'attack\' or \'defense\'' });
            return;
        } else {
            const logType = ServerUtils.formatLogType(req.params.logType);
            // Ids stored as strings in MongoDB.
            const siegeID = parseInt(req.params.siegeID, 10);
            logger.debug(`Querying battleLogs for ${logType} log with siege_id ${siegeID}`);
            dbClient.findDataInCollection({ guild_name: req.params.guildName, log_type: logType, siege_id: siegeID }, 'battleLogs', (error, result) => {
                if (error != null || result[0] == undefined) {
                    logger.error(`Error finding battle log data for match with siege_id ${siegeID}`);
                    res.status(500).send({ error: `Error finding battle log data for match with siege_id ${siegeID}` });
                } else {
                    logger.info(`Successfully found battle log data for match with siege_id ${siegeID}!`);
                    res.send({ result: result[0] });
                }
            });
        }
    });

    server.get('/api/:guildName/battleLogs/:logType/week/:week', (req, res) => {
        logger.info(`Received request for battle log data from week ${req.params.week}`);
        if (!ServerUtils.isValidWeek(req.params.week)) {
            logger.warn('Received invalid week parameter');
            res.status(400).send({ error: 'Given week needs to have format yyyymmww (e.g. 20190402 for 2019 April week 2)' });
            return;
        } else {
            const logType = ServerUtils.formatLogType(req.params.logType);
            // Week format matches first part of siege_id provided by game.
            const idPrefixForWeek = req.params.week;
            // Ids stored as ints in MongoDB.
            const idWeek1 = parseInt(idPrefixForWeek + '01', 10);
            const idWeek2 = parseInt(idPrefixForWeek + '02', 10);
            logger.debug(`Querying ${logType} for matches with siege_ids ${idWeek1}, ${idWeek2}`);
            dbClient.findDataInCollection({ 
                guild_name: req.params.guildName, 
                log_type: logType, 
                $or: [ { siege_id: idWeek1 }, { siege_id: idWeek2 } ] 
            }, 'battleLogs', (error, result) => {
                if (error != null || result.length < 2) {
                    logger.error(`Error finding battle log data for two matches in week ${idPrefixForWeek}`);
                    res.status(500).send({ error: `Error finding battle log data for two matches in week ${idPrefixForWeek}` });
                } else {
                    logger.info(`Successfully found battle log data for matches in week ${idPrefixForWeek}!`);
                    res.send({ 
                        week: idPrefixForWeek,
                        result: result 
                    });
                }
            });
        }
    });

    // Siege Deck database endpoints
    server.post('/api/:guildName/siegeDecks', (req, res) => {
        logger.info('Received siege deck data');
        dbClient.updateDataInCollection({ 
            guild_name: req.params.guildName, 
            player_id: req.body.player_id 
        }, req.body, 'siegeDecks', (error, result) => {
            ServerUtils.sendInsertResponse(error, result, 'siege deck', logger, res);
        });
    });

    server.get('/api/:guildName/siegeDecks', (req, res) => {
        logger.info('Received request for siege deck data');
        dbClient.showDataInCollection(req.params.guildName, 'siegeDecks', (error, result) => {
            ServerUtils.sendSimpleQueryResponse(error, result, 'siege deck', logger, res);
        });
    });

    // Webpage endpoints
    server.get('/aggregateWars/:siegeIDs', (req, res) => {
        logger.info(`Received get request to /aggregateWars/${req.params.siegeIDs}`);
        let siegeList = ServerUtils.formatSiegeList(req.params.siegeIDs.split('+'));
        if (!ServerUtils.isValidSiegeList(siegeList)) {
            logger.warn('Received NaN siegeID');
            res.status(400).send({ error: 'Given siegeID(s) (max 6) need to be the numeric IDs separated by a + (e.g. 2019040301+2019040302)' });
        } else {
            return app.render(req, res, '/aggregateWars', { selectedSieges: siegeList });
        }
    });

    server.get('/aggregateSummary/:siegeIDs', (req, res) => {
        logger.info(`Received get request to /aggregateSummary/${req.params.siegeIDs}`);
        let siegeList = ServerUtils.formatSiegeList(req.params.siegeIDs.split('+'));
        if (siegeList.length == 1) {
            // Redirect to show info for 1 match.
            res.redirect(`/siegeMatch/${siegeList[0]}`);
        }
        if (!ServerUtils.isValidSiegeList(siegeList)) {
            logger.warn('Received NaN siegeID');
            res.status(400).send({ error: 'Given siegeID(s) need to be the numeric IDs separated by a + (e.g. 2019040301+2019040302)' });
        } else {
            return app.render(req, res, '/aggregateSummary', { selectedSieges: siegeList, apiRoute: req.params.siegeIDs });
        }
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