import Game from "../game";

class Gridworld extends Game {

    getInitialState() {

        const initial_state = {
            board:
                [[1, 0, 0, 0],
                [-1, -1, -1, 0],
                [0, -1, 0, 0],
                [0, 0, 0, -1]],
            playerRow: 2,
            playerCol: 0
        };
        return initial_state;
    }

    // take an action and return the reward
    takeAction(state, action) {
        const new_state = JSON.parse(JSON.stringify(state));

        switch (action) {
            case 1: if (new_state.playerRow > 0) { new_state.playerRow--}; break;
            case 2: if (new_state.playerCol < new_state.board[new_state.playerRow].length -1) { new_state.playerCol++ }; break;
            case 3: if (new_state.playerRow < new_state.board.length -1) { new_state.playerRow++ }; break;
            case 4: if (new_state.playerCol > 0) { new_state.playerCol--}; break;
            default: break;
        }

        const reward = new_state.board[new_state.playerRow][new_state.playerCol];
        return { reward: reward, new_state: new_state};
    }

    isEpisodeEnd(state) {
        return this.isWon(state) || this.isLost(state);
    }

    isWon(state) {
        return state.board[state.playerRow][state.playerCol] === 1;
    }

    isLost(state) {
        return state.board[state.playerRow][state.playerCol] === -1;

    }

    isDraw(state) {
        return this.isLost(state);
    }

    // 1 = up
    // 2 = right
    // 3 = down
    // 4 = left
    getPossibleActions(state) {
        return [1, 2, 3, 4];
    }

    // the game is full if every player has placed its mark
    isFull(state) {
        return state.find((current) => current === 0) === undefined;
    }

    getQKey(state, action) {
        return JSON.stringify(state) + "#" + action;
    }

}
export default Gridworld;