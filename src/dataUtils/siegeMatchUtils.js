const _ = require('lodash');

module.exports = {
    filterWeeks(siegeMatchList) {
        let truncatedIDs = siegeMatchList.map((siegeMatch) => {
            let idString = siegeMatch.siege_id.toString();
            // First 8 chars of siegeID correspond to yyyymmww
            let weekString = idString.substring(0,8);
            return weekString;
        });
        // Returns only uniq weeks.
        return _.uniq(truncatedIDs);
    },

    getSiegeMatchSummary(siegeMatchData) {
        return siegeMatchData.guild_list.sort((guild1, guild2) => {
            // Sort in descending order.
            return guild1.points < guild2.points;
        });
    }
};