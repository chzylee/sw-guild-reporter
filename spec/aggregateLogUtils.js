describe('AggregateLogUtils', () => {
    const AggregateLogUtils = require('../src/dataUtils/aggregateLogUtils');
    // Fake player and match data used for some functions.
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
    // Using only the properties relevant to AggregateLogUtils.
    const matchInfo1 = {
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
        let simpleRate = AggregateLogUtils.getSuccessRateFromRecord(record1);
        let decimalRecord = AggregateLogUtils.getSuccessRateFromRecord(record2);
        expect(simpleRate).toBe(50);
        // Round to fixed 4 digits if necessary.
        expect(decimalRecord).toBe(66.67);
    });

    it('should get correct count and indices of ties for best in list of success rates', () => {
        let successRates = [33.33, 50, 66.67, 66.67];
        // Should already be determined by Math.max(...successRates), which need not be tested.
        let bestRate = 66.67;
        let ties = AggregateLogUtils.getTiesForBest(successRates, bestRate);
        expect(ties.length).toBe(2);
        // Indicies obtained as array object key name strings via for-of loop.
        expect(ties[0]).toBe('2');
        expect(ties[1]).toBe('3');
    });

    it('should correctly find index of highest success count from list to break ties', () => {
        // Tie values correspond to indices as given by getTiesForBest().
        let ties = [2, 3];
        let successCounts = [3, 5, 6, 4];
        let highestCountIndex = AggregateLogUtils.getHigherSuccessCount(ties, successCounts);
        expect(highestCountIndex).toBe(2);
    });

    it('should get best performance description based on pairs of player data and match info from week', () => {
        let bestPerformance = AggregateLogUtils.getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
        expect(bestPerformance).toBe('4-2 vs. Guild 3');
    });

    it('should get description for performance with highest success count from player data and match info from week', () => {
        let successPerformance = AggregateLogUtils.getBestPerformance(playerData1, playerData2, matchInfo1, matchInfo2);
        // Gets first record with highest success count with no tie breaker.
        expect(successPerformance).toBe('4-2 vs. Guild 3');
    });

    it('should get a player\'s total success rate for week from a pair of player data', () => {
        let weekSuccessRate = AggregateLogUtils.getWeekSuccessRate(playerData1, playerData2);
        // Round to 4 digits as decimal rate for proper table sorting.
        expect(weekSuccessRate).toEqual('0.5556');
    });

    it('should get performance rating based on success rate and total battles', () => {
        let performanceRating = AggregateLogUtils.getPerformanceRating(playerData1, playerData2);
        // toFixed returns string from number.
        expect(performanceRating).toBe('1000');
    });
});