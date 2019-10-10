const DisplayFormatter = require('..//displayFormatter');

module.exports = {
    getUniqueComps(siegeDecks) {
        let allComps = [];
        for (const player of siegeDecks) {
            for (const deck of player.defenses) {
                let deckMonsters = DisplayFormatter.formatSiegeDeckMonsters(deck.monsters);
                let comp = allComps.find((comp) => {
                    return comp.monsters == deckMonsters;
                });
                if (comp === undefined) {
                    allComps.push({
                        leader: deck.monsters[0],
                        monsters: deckMonsters,
                        successes: deck.successes,
                        fails: deck.fails,
                        total: deck.total,
                    });
                } else {
                    comp.successes += deck.successes;
                    comp.fails += deck.fails;
                    comp.total += deck.total;
                }
            }
        }

        return allComps.sort((comp1, comp2) => {
            return comp1.monsters > comp2.monsters;
        });
    }
};