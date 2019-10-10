describe('DisplayFormatter', () => {
    const DisplayFormatter = require('../src/displayFormatter');
    // Test all siegeID-related functions with the same ID.
    // Ids obtained from  DB as numbers.
    let siegeID = 2019040302;
    // Siege weeks come from siegeID minus index for war number.
    let siegeWeek = 20190403;

    it('should get correct month name string from number string', () => {
        // Month number comes as string parsed from siegeID string.
        let monthNum = '04';
        let fakeEarlyMonth = '00';
        let fakeLateMonth = '13';
        let badInput = 'ab';
        let monthName = DisplayFormatter.getMonthName(monthNum);
        expect(monthName).toBe('April');
        expect(DisplayFormatter.getMonthName(fakeEarlyMonth)).toBe('Invalid month string');
        expect(DisplayFormatter.getMonthName(fakeLateMonth)).toBe('Invalid month string');
        expect(DisplayFormatter.getMonthName(badInput)).toBe('Invalid month string');
    });

    it('should get human readable title from siegeID', () => {
        let siegeDateTitle = DisplayFormatter.getSiegeDateTitle(siegeID);
        let invalidTitle = DisplayFormatter.getSiegeDateTitle('notasiegeid');
        expect(siegeDateTitle).toBe('April 2019, Week 3, War 2');
        expect(invalidTitle).toBe('Invalid siege ID');
    });

    it('should get human readable simplified label from siegeID', () => {
        let siegeDateLabel = DisplayFormatter.getSiegeDateLabel(siegeID);
        let invalidDateLabel = DisplayFormatter.getSiegeDateLabel('notasiegeid');
        // 2/2 refers to war 2 out of the 2 for the week.
        expect(siegeDateLabel).toBe('04/2019 week 3: 2/2');
        expect(invalidDateLabel).toBe('Invalid siege ID');
    });

    it('should format battle count for proper sorting in table', () => {
        let battleCount = 9;
        let formattedCount = DisplayFormatter.formatTotalBattles(battleCount);
        // Leading space is considered < '10' in string comparison.
        expect(formattedCount).toBe(' 9');
    });

    it('should format log type from database form for title', () => {
        let logType = 'attack-logs';
        let notLogType = 'notalogtype';
        let formattedType = DisplayFormatter.formatLogType(logType);
        expect(formattedType).toBe('Attack');
        expect(DisplayFormatter.formatLogType(notLogType)).toBe('Invalid log type');
    });

    it('should get the correct column label for a battle log type', () => {
        let attackType = 'attack-logs';
        let defenseType = 'defense-logs';
        let attackLabel = DisplayFormatter.getTotalAttemptsLabel(attackType);
        let defenseLabel = DisplayFormatter.getTotalAttemptsLabel(defenseType);
        expect(attackLabel).toBe('Total Battles');
        expect(defenseLabel).toBe('Total Placements');
        expect(DisplayFormatter.getTotalAttemptsLabel('notatype')).toBe('Invalid log type');
    });

    it('should get the correct column field name for a battle log type', () => {
        let attackType = 'attack-logs';
        let defenseType = 'defense-logs';
        let attackLabel = DisplayFormatter.getTotalAttemptsField(attackType);
        let defenseLabel = DisplayFormatter.getTotalAttemptsField(defenseType);
        expect(attackLabel).toBe('totalBattles');
        expect(defenseLabel).toBe('totalPlacements');
        expect(DisplayFormatter.getTotalAttemptsField('notatype')).toBe('invalidLogType');
    });

    it('should format player success rate to truncated decimal', () => {
        let successRateDecimal = 0.66667;
        let formattedRate = DisplayFormatter.formatPlayerSuccessRate(successRateDecimal);
        // Player rate in decimal form for proper sorting by string in table
        expect(formattedRate).toBe('0.66');
    });

    it('should format W-L record for proper sorting in table', () => {
        let normalRecord = '8-2 vs. Guild 1';
        let perfectRecord = '10-0 vs. Guild 1';
        let formattedNormal = DisplayFormatter.formatRecordDescription(normalRecord);
        let formattedPerfect = DisplayFormatter.formatRecordDescription(perfectRecord);
        expect(formattedNormal).toBe('8-2 vs. Guild 1'); // imperfect record intentionally unchanged
        expect(formattedPerfect).toBe('Perfect 10-0 vs. Guild 1'); // P > any digit, so 10-0 > 9-0 this way
    });

    it('should format performance rating for proper sorting in table', () => {
        let lowRating = '900';
        let highRating = '2000';
        let formattedLow = DisplayFormatter.formatPerformanceRating(lowRating);
        let formattedHigh = DisplayFormatter.formatPerformanceRating(highRating);
        expect(formattedLow).toBe(' 900'); // leading space makes it properly < '1000'
        expect(formattedHigh).toBe('2000'); // intentionally untouched
    });

    it('should get short title for one match describing when in a week it occurred given match data', () => {
        // Data organized same way as in real JSON data.
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
        let firstMatchTitle = DisplayFormatter.getSiegeMatchTitle(firstMatchData);
        let secondMatchTitle = DisplayFormatter.getSiegeMatchTitle(secondMatchData);
        expect(firstMatchTitle).toBe('Monday-Tuesday War');
        expect(secondMatchTitle).toBe('Thursday-Friday War');
    });

    it('should get simple attack summary guild data', () => {
        // Simplified version of data from guild_list of siege match data in DB.
        let guildInfo = {
            attacks_used: 210,
            registered_attackers: 24
        };
        let attackSummary = DisplayFormatter.getGuildAttackSummary(guildInfo);
        expect(attackSummary).toBe('210/240');
    });

    it('should format siege deck monster list into simpler label', () => {
        let siegeDeckMonsters = ['Monster 1', 'Monster 2', 'Monster 3'];
        let formattedDeck = DisplayFormatter.formatSiegeDeckMonsters(siegeDeckMonsters);
        expect(formattedDeck).toBe('Monster 1 (L) Monster 2 Monster 3');
    });

    it('should format siege deck success rate to percent up to 2 decimal places', () => {
        let successRate = 0.7142;
        let formattedRate = DisplayFormatter.formatDeckSuccessRate(successRate);
        expect(formattedRate).toBe('71.42%');
    })
});