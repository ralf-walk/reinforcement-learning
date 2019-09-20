import Game from "../game";

class TicTacToe extends Game {

    getInitialState() {
        const initial_state = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Player 2 starts
        const action_to_choose = Math.floor(Math.random() * 9);
        initial_state[action_to_choose] = 2;
        return initial_state;
    }

    // take an action and return the reward
    takeAction(state, action) {
        const new_state = state.slice();
        new_state[action] = 1;

        // let computer take its action randomly
        if (!this.isFull(new_state) && !this.hasPlayerWon(state, 1)) {
            const possible_actions = this.getPossibleActions(new_state);
            const action_to_choose = Math.floor(Math.random() * (possible_actions.length));
            new_state[possible_actions[action_to_choose]] = 2;
        }

        let reward = 0;
        // calculate the reward
        if (this.hasPlayerWon(new_state, 1)) {
            reward = 1;
        } else if (this.hasPlayerWon(new_state, 2)) {
            reward = -1;
        } else if (this.isFull(new_state)) {
            reward = 0.5;
        }

        return {reward: reward, new_state: new_state};
    }

    isEpisodeEnd(state) {
        return this.isWon(state) || this.isLost(state) || this.isDraw(state);
    }

    isWon(state) {
        return this.hasPlayerWon(state, 1);
    }

    isLost(state) {
        return this.hasPlayerWon(state, 2);

    }

    isDraw(state) {
        return this.isFull(state) && !this.isWon(state) && !this.isLost(state);
    }

    hasPlayerWon(s, p) {
        return ((s[0] === p && s[3] === p && s[6] === p)
            || (s[1] === p && s[4] === p && s[7] === p)
            || (s[2] === p && s[5] === p && s[8] === p)
            || (s[0] === p && s[1] === p && s[2] === p)
            || (s[3] === p && s[4] === p && s[5] === p)
            || (s[6] === p && s[7] === p && s[8] === p)
            || (s[0] === p && s[4] === p && s[8] === p)
            || (s[2] === p && s[4] === p && s[6] === p));
    }

    // get the indexed (= possible actions) of the environment where the player can place its mark (1 or 2)
    // [ 1, 0, 2, 1, 0, 0, 0, 2, 1 ] => [ 1, 4, 5, 6 ]
    getPossibleActions(state) {
        return state
            .map((current, index) => (current === 0) ? index : -1)
            .filter((current) => current > -1)
    }

    // the game is full if every player has placed its mark
    isFull(state) {
        return state.find((current) => current === 0) === undefined;
    }

    getQKey(state, action) {
        return state.toString() + "#" + action;
    }

}

export default TicTacToe;