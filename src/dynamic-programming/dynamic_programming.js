import React from 'react';

class DynamicProgramming extends React.Component {

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.nextIteration = this.nextIteration.bind(this);
        this.reset = this.reset.bind(this);

        this.reset();
    }

    render() {
        return (
            <div className="TicTacToe">
                <h2>Tic Tac Toe</h2>
                <p>{this.game.toString()}</p>
                <button onClick={this.nextIteration}>
                    Next iteration
                </button>
                <button onClick={this.reset}>
                    Reset
                </button>
            </div>
        )
    }

    nextIteration() {
        // do policy evaluation
        this.currentPolicyEvaluationValueFunction = this.doPolicyEvaluation(this.mdp, this.currentPolicyEvaluationValueFunction);
        this.currentPolicyFunction = this.doPolicyImprovement(this.mdp, this.currentPolicyEvaluationValueFunction, this.currentPolicyFunction);

        // do policy improvement from the latest generated value function
        this.currentValueEvaluationValueFunction = this.doValueEvaluation(this.mdp, this.currentValueEvaluationValueFunction);

        this.forceUpdate();
    }

    reset() {
        this.currentIteration = 0;
        this.currentPolicyEvaluationValueFunction = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.currentPolicyFunction = [[1111, 1111, 1111, 1111], [1111, 1111, 1111, 1111], [1111, 1111, 1111, 1111], [1111, 1111, 1111, 1111]];

        this.currentValueEvaluationValueFunction = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.forceUpdate();
    }

    mdp = {
        environment: [[0, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, 0]], //size 4 x 4
        action: (state) => {
            let reachable_states = [];
            if (state[0] == 0 && state[1] == 0 || state[0] == 3 && state[1] == 3) {
                // if we are in a terminal state, there is no way to get out
                reachable_states.push({state: [0, 0], action: 0});
            } else {
                // consider alle states if we got north, east, south, or west from this state
                // we have to stay in the same state when we reach the wall
                reachable_states.push({state: [state[0], Math.max(state[1] - 1, 0)], action: 1000}); // west
                reachable_states.push({state: [Math.min(state[0] + 1, 3), state[1]], action: 100}); // south
                reachable_states.push({state: [state[0], Math.min(state[1] + 1, 3)], action: 10}); // east
                reachable_states.push({state: [Math.max(state[0] - 1, 0), state[1]], action: 1}); // north
            }
            return reachable_states;
        },
        reward: (state, action) => (state[0] == 0 && state[1] == 0 || state[0] == 3 && state[1] == 3) ? 0 : -1
    }

    doPolicyEvaluation(mdp, value_function) {
        let new_value_function = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

        // for all states
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {

                let state = [i, j];

                let new_value = 0;

                let reachable_states = mdp.action(state);

                for (let reachable_state of reachable_states) {

                    let action = reachable_state.action;
                    let r_state = reachable_state.state;

                    // get the reward for the state transition
                    let reward = mdp.reward(state, action)

                    let state_prime_value = value_function[r_state[0]][r_state[1]];

                    // calculate the value of state by adding the reward for the transition plus the cached value from the next state
                    new_value += (reward + state_prime_value) * 0.25;
                    //console.log("BAUM STATE " + state + " REWARD " + reward + " VALUE "+ state_prime_value + " ACTION " + action + " NEW " + (reward + state_prime_value) * 0.25);   
                }
                new_value_function[state[0]][state[1]] = new_value;
            }
        }

        return new_value_function;
    }

    // old policy is just for the stabilization propery
    doPolicyImprovement(mdp, value_function, old_policy) {
        let policy = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

        let stable = true;

        // for all states
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {

                let state = [i, j];

                let new_value;
                let greedy_action = 0;

                let reachable_states = mdp.action(state);

                for (let reachable_state of reachable_states) {

                    let action = reachable_state.action;
                    let r_state = reachable_state.state;

                    // get the reward for the state transition
                    let reward = mdp.reward(state, action)

                    let state_prime_value = value_function[r_state[0]][r_state[1]];

                    // calculate the value of state by adding the reward for the transition plus the cached value from the next state

                    if (!new_value || new_value < (reward + state_prime_value)) {
                        new_value = (reward + state_prime_value);
                        greedy_action = action;
                    } else if (new_value == (reward + state_prime_value)) {
                        greedy_action += action;
                    }
                }
                // console.log("HANS", old_policy);
                if (greedy_action != old_policy[state[0]][state[1]]) {
                    stable = false;
                }
                policy[state[0]][state[1]] = greedy_action;
            }
        }
        return policy;
    }

    doValueEvaluation(mdp, value_function) {
        let new_value_function = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

        // for all states
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {

                let state = [i, j];

                let new_value;

                let reachable_states = mdp.action(state);

                for (let reachable_state of reachable_states) {

                    let action = reachable_state.action;
                    let r_state = reachable_state.state;

                    // get the reward for the state transition
                    let reward = mdp.reward(state, action)

                    let state_prime_value = value_function[r_state[0]][r_state[1]];

                    // calculate the value of state by adding the reward for the transition plus the cached value from the next state
                    if (!new_value || new_value < (reward + state_prime_value)) {
                        new_value = (reward + state_prime_value);
                    }
                }
                new_value_function[state[0]][state[1]] = new_value;
            }
        }
        return new_value_function;
    }
}

export default DynamicProgramming;