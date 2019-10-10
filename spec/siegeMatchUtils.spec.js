describe('SiegeMatchUtils', () => {
    const SiegeMatchUtils = require('../src/dataUtils/siegeMatchUtils');

    it('should filter week ids from list of siege match ids', () => {
        // Query for siege id list from DB comes in this format.
        let siegeMatchList = [
            { siege_id: 2019040302 },
            { siege_id: 2019040301 },
            { siege_id: 2019040202 },
            { siege_id: 2019040201 },
        ];
        let siegeWeeks = SiegeMatchUtils.filterWeeks(siegeMatchList);
        expect(siegeWeeks).toEqual(['20190403', '20190402']);
    });

    it('should get match summary as list of guilds in descending order of points', () => {
        // Only included object fields relevant to what data is needed to determine order.
        let siegeMatchData = {
            guild_list: [
                { name: 'Guild 1', points: '15000' },
                { name: 'Guild 2', points: '20000' },
                { name: 'Guild 3', points: '17500' }
            ]
        };
        let scoreSummary = SiegeMatchUtils.getSiegeMatchSummary(siegeMatchData);
        expect(scoreSummary).toEqual([
            { name: 'Guild 2', points: '20000' },
            { name: 'Guild 3', points: '17500' },
            { name: 'Guild 1', points: '15000' }
        ])
    });
});