# Snake Game

Play online at https://a-yasui.github.io/snake-game-test/.

Use arrow keys or the on-screen buttons to steer the snake and collect food.

## Gameplay

- Board is 35x35 tiles and the snake moves every 0.2 seconds. Speed increases to 0.15 seconds per move when the snake reaches length 10 and to 0.10 seconds per move at length 20.
- Game starts with five food items on the board.
- When only three items remain, new food spawns every few seconds until there are eight.
- Each food is worth 10 points and grows the snake by one tile.
- Occasionally a yellow speed-up item appears. Eating it makes the snake move ten times faster for a few seconds.
- Game ends if the snake is stuck against a wall or itself for more than one second.
- The snake blinks between green and red when it collides with itself, giving you a moment to steer away.
- The head displays an arrow (▲, ▼, ◀, ▶) indicating its current direction.

To play locally, open `index.html` in a browser.

