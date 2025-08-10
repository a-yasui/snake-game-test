# Snake Game

Play online at https://a-yasui.github.io/snake-game-test/.

Use arrow keys or the on-screen buttons to steer the snake and collect food.

## Gameplay

- Board is 35x35 tiles. The snake moves every 0.2 seconds and gains speed by 0.05 seconds for each 10 tiles of length (0.15s at length 10, 0.10s at length 20, down to a minimum of 0.05s).
- Game starts with five food items on the board.
- When only three items remain, new food spawns every few seconds until there are eight.
- Each food is worth 10 points and grows the snake by one tile.
- Occasionally a yellow speed-up item appears. Eating it makes the snake move ten times faster for a few seconds.
- Game ends if the snake is stuck against a wall or itself for more than one second.
- The snake blinks between green and red when it collides with itself, giving you a moment to steer away.
- The head displays an arrow (▲, ▼, ◀, ▶) indicating its current direction.

To play locally, open `index.html` in a browser.

