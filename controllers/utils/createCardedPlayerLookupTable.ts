import { CardedPlayer } from '../../types';

// create a lookup table for cardedPlayers
export default function createCardedPlayerLookupTable(cardedPlayers: CardedPlayer[], priority: 'ab' | 'ip'): Map<string, string> {
    const lookup = new Map<string, string>();

    cardedPlayers.forEach(player => {
        const key = priority === 'ab'
            ? `${player.year}-${player.abbrev_name.toLowerCase()}-${player.ab}`
            : `${player.year}-${player.abbrev_name.toLowerCase()}-${player.ip}`;
        lookup.set(key, player.rml_team);
    });

    return lookup;
}
