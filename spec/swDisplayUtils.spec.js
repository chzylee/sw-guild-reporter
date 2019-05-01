describe('SWDataUtils', () => {
    const SWDisplayUtils = require('../src/swDisplayUtils');
    // Test all siegeID-related functions with the same ID
    let siegeID = 2019040302; // obtained from  DB as numbers

    it('should get correct month name string from number string', () => {
        let monthNumString = '04'; // month number comes as string parsed from siegeID string
        let monthName = SWDisplayUtils.getMonthName(monthNumString);
        expect(monthName).toBe('April');
    });

    it('should get human readable title from siegeID', () => {
        let siegeDateTitle = SWDisplayUtils.getSiegeDateTitle(siegeID);
        expect(siegeDateTitle).toBe('April 2019, Week 3, War 2');
    });

    it('should get human readable simplified label from siegeID', () => {
        let siegeDateLabel = SWDisplayUtils.getSiegeDateLabel(siegeID);
        expect(siegeDateLabel).toBe('04/2019 week 3: 2/2'); // 2/2 refers to war 2 out of the 2 for the week
    });

    it('should get humen readable title from siege week', () => {
        let siegeWeek = 20190403; // siege weeks come from siegeID minus index for war number
        let siegeWeekTitle = SWDisplayUtils.getSiegeWeekTitle(siegeWeek);
        expect(siegeWeekTitle).toBe('Wars for Week 3 of April 2019');
    });

    it('should get readable label for total success rate from list of week\'s battle logs', () => {
        // log objects shortened for purpose of this function
        let weekLogList = [
            { battle_logs: { successes: { total: 40 }, attempts: { total: 50 } } },
            { battle_logs: { successes: { total: 20 }, attempts: { total: 40 } } },
        ];
        let weekSuccessLabel = SWDisplayUtils.getWeekSuccessRateLabel(weekLogList);
        // round to 2 decimal places normalizing to 0-100% and add spaces for better spacing in UI
        expect(weekSuccessLabel).toBe(' 60/90  (66.67%)');
    });

    it('should format battle count for proper sorting in table', () => {
        let battleCount = 9;
        let formattedCount = SWDisplayUtils.formatTotalBattles(battleCount);
        expect(formattedCount).toBe(' 9'); // leading space is considered < '10' in string comparison
    });

    it('should format log type from database form for title', () => {
        let logType = 'attack-logs';
        let formattedType = SWDisplayUtils.formatLogType(logType);
        expect(formattedType).toBe('Attack');
    });

    it('should format player success rate to truncated decimal', () => {
        let successRateDecimal = 0.66667;
        let formattedRate = SWDisplayUtils.formatPlayerSuccessRate(successRateDecimal);
        expect(formattedRate).toBe('0.66'); // player rate in decimal form for proper sorting by string in table
    });

    it('should format W-L record for proper sorting in table', () => {
        let normalRecord = '8-2 vs. Guild 1';
        let perfectRecord = '10-0 vs. Guild 1';
        let formattedNormal = SWDisplayUtils.formatRecordDescription(normalRecord);
        let formattedPerfect = SWDisplayUtils.formatRecordDescription(perfectRecord);
        expect(formattedNormal).toBe('8-2 vs. Guild 1'); // imperfect record intentionally unchanged
        expect(formattedPerfect).toBe('Perfect 10-0 vs. Guild 1'); // P > any digit, so 10-0 > 9-0 this way
    });

    it('should format performance rating for proper sorting in table', () => {
        let lowRating = '900';
        let highRating = '2000';
        let formattedLow = SWDisplayUtils.formatPerformanceRating(lowRating);
        let formattedHigh = SWDisplayUtils.formatPerformanceRating(highRating);
        expect(formattedLow).toBe(' 900'); // leading space makes it properly < '1000'
        expect(formattedHigh).toBe('2000'); // intentionally untouched
    });

    it('should get short title for one match describing when in a week it occurred given match data', () => {
        let firstMatchData = {
            match_info: {
                siege_id: 2019040301
            }
        };
        let secondMatchData = {
            match_info: {
                siege_id: 2019040302
            }
        };
        let firstMatchTitle = SWDisplayUtils.getSiegeMatchTitle(firstMatchData);
        let secondMatchTitle = SWDisplayUtils.getSiegeMatchTitle(secondMatchData);
        expect(firstMatchTitle).toBe('Monday-Tuesday War');
        expect(secondMatchTitle).toBe('Thursday-Friday War');
    });

    it('should get simple attack summary guild data', () => {
        let guildInfo = {
            attacks_used: 210,
            registered_attackers: 24
        }; // simplified version of data from guild_list of siege match data in DB
        let attackSummary = SWDisplayUtils.getGuildAttackSummary(guildInfo);
        expect(attackSummary).toBe('210/240');
    });

    it('should format siege deck monster list into simpler label', () => {
        let siegeDeckMonsters = ['Monster 1', 'Monster 2', 'Monster 3'];
        let formattedDeck = SWDisplayUtils.formatSiegeDeckMonsters(siegeDeckMonsters);
        expect(formattedDeck).toBe('Monster 1 (L) Monster 2 Monster 3');
    });

    it('should format siege deck success rate to percent up to 2 decimal places', () => {
        let successRate = 0.7142;
        let formattedRate = SWDisplayUtils.formatDeckSuccessRate(successRate);
        expect(formattedRate).toBe('71.42%');
    })
});