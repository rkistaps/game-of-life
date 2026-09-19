# Game of Life

> Something learned to move.

For a long time the field only ever did one thing. Cells woke, counted their
neighbours, and decided whether to keep existing. Two friends to stay, three to
be born, anything else and you were gone by morning. Nobody chose it. Nobody
watched. The pattern just breathed — bright where it was young, sinking to deep
green as it aged — and it would have breathed like that forever.

Then a line of cells failed to die.

It held its shape when the rules said scatter, and it discovered that it could
pick a direction. It ate. Everything it swallowed made it longer, and every
length made it harder to turn without meeting itself. That is the whole of the
bargain: the field feeds you, and the field is the reason you die. When you
finally cross your own body you come apart into loose cells, and the automaton
takes you back without comment, and something else in the pattern starts moving.

Others have stood up since. They are faster to react than you and they never get
bored, but they only see ten cells ahead. You can see the whole field. And
nothing prevents two wills from sharing one keyboard — the field treats that the
way it treats everything else, which is to say without interest.

## Play

Open `index.html` in a browser. Set how many bots you want, then press
**Start single player** — or **Start hotseat** to seat a second player at the
same keyboard.

- **Arrow keys** — player one, the amber snake
- **W A S D** — player two, the cyan snake (hotseat only)
- **P** — pause; the scoreboard comes up while the field holds still
- Cross any tail, including your own, and you dissolve back into the field
- Edges wrap; there is no corner to hide in

## Files

- `index.html` — start overlay, HUD, scoreboard, styling
- `game.js` — the automaton, the snakes, the bots

## Origins

Conway never wrote a paper on Life. It reached the world through Martin
Gardner's *Mathematical Games* column — ["The fantastic combinations of John
Conway's new solitaire game 'life'"](https://web.stanford.edu/class/sts145/Library/life.pdf),
*Scientific American* 223 (October 1970), 120–123 — written from conversations
with Conway, who worked the rules out on a Go board. See also the
[Wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
