describe('SWDataUtils', () => {
    const SWDataUtils = require('../src/swDataUtils');
    // fake player and match data used for some functions
    const playerData1 = {
        recordVsGuild1: `1-2`,
        recordVsGuild2: `3-3`,
        successesVsGuild1: 1,
        successesVsGuild2: 3,
        totalSuccesses: 4,
        totalBattles: 9
    }
    const playerData2 = {
        recordVsGuild1: `4-2`,
        recordVsGuild2: `2-1`,
        successesVsGuild1: 4,
        successesVsGuild2: 2,
        totalSuccesses: 6,
        totalBattles: 9
    };
    const matchInfo1 = { // using only the properties relevant to SWDataUtils
        opposing_guild_1: 'Guild 1',
        opposing_guild_2: 'Guild 2'
    };
    const matchInfo2 = {
        opposing_guild_1: 'Guild 3',
        opposing_guild_2: 'Guild 4'
    };

    it('should return correct success rate decimal value from W-L record', () => {
        let record1 = '2-2 vs. Guild 1';
        let record2 = '6-3 vs. Guild 2';
        let simpleRate = SWDataUtils.getSuccessRateFromRecord(record1);
        let decimalRecord = SWDataUtils.getSuccessRateFromRecord(record2);
        expect(simpleRate).toBe(50);
        expect(decimalRecord).toBe(66.67); // round to fixed 4 digits if necessary
    });

    it('should get correct count and indices of ties for best in list of success rates', () => {
        let successRates = [33.33, 50, 66.67, 66.67];
        let bestRate = 66.67; // should already be determined by Math.max(...successRates)
        let ties = SWDataUtils.getTiesForBest(successRates, bestRate);
        expect(ties.length).toBe(2);
        expect(ties[0]).toBe('2'); // indicies obtained as array object key names via for-of loop
        expect(ties[1]).toBe('3');
    });

    it('should correctly find index of highest success count from list to break ties', () => {
        let ties = [2, 3];
        let successCounts = [3, 5, 6, 4];
        let highestCountIndex = SWDataUtils.getHigherSuccessCount(ties, successCounts);
        expect(highestCountIndex).toBe(2);
    });

    it('should get best performance description based on pairs of player data and match info from week', () => {
        let bestPerformance = SWDataUtils.getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
        expect(bestPerformance).toBe('4-2 vs. Guild 3');
    });

    it('should get description for performance with highest success count from player data and match info from week', () => {
        let successPerformance = SWDataUtils.getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
        expect(successPerformance).toBe('4-2 vs. Guild 3'); // gets first record with highest success count with no tie breaker
    });

    it('should get a player\'s total success rate for week from a pair of player data', () => {
        let weekSuccessRate = SWDataUtils.getWeekSuccessRate(playerData1, playerData2);
        expect(weekSuccessRate).toEqual('0.5556'); // round to 4 digits as decimal rate for proper table sorting
    });

    it('should get performance rating based on success rate and total battles', () => {
        let performanceRating = SWDataUtils.getPerformanceRating(playerData1, playerData2);
        expect(performanceRating).toBe('1000'); // toFixed returns string from number
    });

    it('should filter week ids from list of siege match ids', () => {
        let siegeMatchList = [
            { siege_id: 2019040302 },
            { siege_id: 2019040301 },
            { siege_id: 2019040202 },
            { siege_id: 2019040201 },
        ]; // query for id list from DB comes in this format
        let siegeWeeks = SWDataUtils.filterWeeks(siegeMatchList);
        expect(siegeWeeks).toEqual(['20190403', '20190402']);
    });

    it('should get match summary as list of guilds in descending order of points', () => {
        let siegeMatchData = {
            guild_list: [
                { name: 'Guild 1', points: '15000' },
                { name: 'Guild 2', points: '20000' },
                { name: 'Guild 3', points: '17500' }
            ]
        }; // only included object fields relevant to what data is needed to determine order
        let scoreSummary = SWDataUtils.getSiegeMatchSummary(siegeMatchData);
        expect(scoreSummary).toEqual([
            { name: 'Guild 2', points: '20000' },
            { name: 'Guild 3', points: '17500' },
            { name: 'Guild 1', points: '15000' }
        ])
    });

    it('should take list of player siege decks and get all unique monster compositions', () => {
        let playerDecks = [
            {
                defenses: [
                    { 
                        monsters: ['Monster 1', 'Monster 2', 'Monster 3'],
                        successes: 1,
                        fails: 1,
                        total: 2,
                    }
                ]
            },
            {
                defenses: [
                    { 
                        monsters: ['Monster 2', 'Monster 3', 'Monster 1'],
                        successes: 1,
                        fails: 1,
                        total: 2, 
                    }
                ]
            },
            {
                defenses: [
                    { 
                        monsters: ['Monster 2', 'Monster 3', 'Monster 1'],
                        successes: 1,
                        fails: 1,
                        total: 2, 
                    }
                ]
            },
        ]; // minimal format for function, and different monster order counts as different comp
        let uniqueDecks = SWDataUtils.getUniqueComps(playerDecks);
        expect(uniqueDecks).toEqual([
            { 
                leader: 'Monster 1',
                monsters: 'Monster 1 (L) Monster 2 Monster 3',
                successes: 1,
                fails: 1,
                total: 2,
            }, 
            { 
                leader: 'Monster 2',
                monsters: 'Monster 2 (L) Monster 3 Monster 1',
                successes: 2,
                fails: 2,
                total: 4, 
            },
        ]);
    });
});