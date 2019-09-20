class QLearning {

    game;

    constructor(game) {
        this.game = game;
    }

    // this table is the size state * actions and stores the q values for each state/action pair
    q_table = {};

    do_q_learning(epsilon = 0.2) {

        let state = this.game.getInitialState();

        while (!this.game.isEpisodeEnd(state)) {
            let action;

            // the q learning uses an epsilon-greedy strategy.
            const do_explore = Math.random() < epsilon;

            if (do_explore) {
                // if exploring, choose a random action
                const possible_actions = this.game.getPossibleActions(state);
                const action_to_choose = Math.floor(Math.random() * (possible_actions.length));
                action = possible_actions[action_to_choose];
            } else {
                // if exploiting choose the next best action based on the Q-table
                const possible_actions = this.game.getPossibleActions(state);

                let highest_q_value = 0;
                let best_action = null;
                for (action of possible_actions) {
                    const q_value = this.q_table[this.game.getQKey(state, action)];
                    if (best_action == null || q_value > highest_q_value) {
                        highest_q_value = q_value;
                        best_action = action;
                    }
                }
                action = best_action;
            }

            // now transition to the next state with the chosen action
            const result = this.game.takeAction(state, action);
            const reward = result.reward;
            const new_state = result.new_state;

            // do the bellman update for the current action with the received reward
            this.do_bellman_update(state, action, reward, new_state);

            state = new_state;
        }
        return state;
    }

    do_bellman_update(state, action, reward, new_state) {

        // Q(s,a)
        const q_value_key = this.game.getQKey(state, action);
        const current_q_value = this.q_table[q_value_key] || 0;

        // no final state, we also have to add the maximum value over all future actions we can take in the new_state
        const future_actions = this.game.getPossibleActions(new_state);

        // do a lookup in our q-table to get the next_state/action pair with the highest q value
        let maximum_future_reward = 0;
        for (let future_action of future_actions) {
            const next_q_value = this.q_table[this.game.getQKey(new_state, future_action)] || 0;
            if (next_q_value > maximum_future_reward) {
                maximum_future_reward = next_q_value;
            }
        }

        // do a discount on the next_reward because it is more uncertain that we get this future reward
        const new_reward = (reward + 0.95 * maximum_future_reward);
        const error = new_reward - current_q_value;

        // finally update our current Q value
        this.q_table[q_value_key] = (current_q_value + 0.1 * error);
    }
}
export default QLearning;