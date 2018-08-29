/*
 *  KEY FOR MAP
 *    'W' is a wall
 *    ' ' is an open space
 *    'O' is an initially open storage location
 *    'B' is a starting position of a box/crate
 *    'X' is a storage location with a box already on it
 *    'S' is the player's starting position 
 */
const map = [
  "  WWWWW ",
  "WWW   W ",
  "WOSB  W ",
  "WWW BOW ",
  "WOWWB W ",
  "W W O WW",
  "WB XBBOW",
  "W   O  W",
  "WWWWWWWW"
];

const gameGridHeight = map.length;
const gameGridWidth = map[0].length;

