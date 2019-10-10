describe('PlayerDeckUtils', () => {
    const PlayerDeckUtils = require('../src/dataUtils/playerDeckUtils');

    it('should take list of player siege decks and get all unique monster compositions with leader', () => {
        // Minimal format for function, and different monster order counts as different comp.
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
        ];
        let uniqueDecks = PlayerDeckUtils.getUniqueComps(playerDecks);
        expect(uniqueDecks).toEqual([
            { 
                leader: 'Monster 1',
                monsters: 'Monster 1 (L) Monster 2 Monster 3',
                successes: 1,
                fails: 1,
                total: 2,
            },
            // Composition is unique, but performance data is totalled.
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