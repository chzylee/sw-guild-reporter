describe('ServerUtils', () => {
    const ServerUtils = require('../src/serverUtils');

    // not testing response functions since they just wrap express api funcs

    it('should return proper number limit or error for different potential counts', () => {
        // parameters received as strings from express route
        let allLimit = ServerUtils.getLimitForCount('all');
        let recentLimit = ServerUtils.getLimitForCount('recent');
        let numberLimit = ServerUtils.getLimitForCount('9');
        let invalidLimit = ServerUtils.getLimitForCount('-21');
        expect(allLimit).toBe(0);
        expect(recentLimit).toBe(5); // specifically just get 5 most recent
        expect(numberLimit).toBe(9);
        expect(invalidLimit).toBe(-1); // for error checking
    });

    it('should determine if given log type is valid for query', () => {
        // log type in api route is simplified form of type stored in database
        let isAttackValid = ServerUtils.isValidLogType('attack');
        let isDefenseValid = ServerUtils.isValidLogType('defense');
        let isNeitherValid = ServerUtils.isValidLogType('battle');
        expect(isAttackValid).toBe(true);
        expect(isDefenseValid).toBe(true);
        expect(isNeitherValid).toBe(false);
    });

    it('should format api route log type for MongoDB query', () => {
        // no error checking since this call always follows validity check
        let formattedAttack = ServerUtils.formatLogType('attack');
        let formattedDefense = ServerUtils.formatLogType('defense');
        expect(formattedAttack).toBe('attack-logs');
        expect(formattedDefense).toBe('defense-logs');
    });

    it('should determine if given week ID is reasonably viable', () => {
        let possibleWeek = '20190403'; // format is yyymmww
        let impossibleYear = '20080403';
        let impossibleMonth = '20191303';
        let impossibleWeek = '20190406'; // no month can count more than 5 weeks for siege matches
        let isPossibleValid = ServerUtils.isValidWeek(possibleWeek);
        let isYearValid = ServerUtils.isValidWeek(impossibleYear);
        let isMonthValid = ServerUtils.isValidWeek(impossibleMonth);
        let isWeekValid = ServerUtils.isValidWeek(impossibleWeek);
        expect(isPossibleValid).toBe(true);
        expect(isYearValid).toBe(false);
        expect(isMonthValid).toBe(false);
        expect(isWeekValid).toBe(false);
    });

    it('should validate siege list by confirming it is list of numeric IDs and has 1-6 IDs', () => {
        let siegeIDs = [2019040301, 2019040302, 2019040401, 2019040402, 2019050101, 2019050102];
        let noIDs = [];
        // Values do not matter.
        let tooManyIDs = [
            2019040301, 2019040302, 2019040401, 2019040402, 2019050101, 2019050102, 2019050201, 2019050202];
        expect(ServerUtils.isValidSiegeList(siegeIDs)).toBe(true);
        expect(ServerUtils.isValidSiegeList(noIDs)).toBe(false);
        expect(ServerUtils.isValidSiegeList(tooManyIDs)).toBe(false);
    });
});