import React from 'react';

// init gridworld
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
        <div className="DynamicProgramming">
            <h2>Policy Evaluation</h2>
            <table> {
                this.currentPolicyEvaluationValueFunction.map(function(value) {
                    return (
                        <tr>
                            {value.map(function(v) {
                                return <th>{v}</th>
                            })}
                        </tr>
                    )
                })
            }
            </table>
            <h2>Value Evaluation</h2>
            <table> {
                this.currentValueEvaluationValueFunction.map(function(value) {
                    return (
                        <tr>
                            {value.map(function(v) {
                                return <th>{v}</th>
                            })}
                        </tr>
                    )
                })
            }
            </table>
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
        this.currentPolicyEvaluationValueFunction = this.doPolicyEvaluation(this.mdp, this.currentPolicyEvaluationValueFunction);
        this.currentValueEvaluationValueFunction = this.doValueEvaluation(this.mdp, this.currentValueEvaluationValueFunction);
        this.forceUpdate();
    }

    reset() {
        this.currentIteration = 0;
        this.currentPolicyEvaluationValueFunction = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.currentValueEvaluationValueFunction = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.forceUpdate();
    }

    mdp = {
        environment: [[0, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, 0]], //size 4 x 4
        action: (state) => {
            // random policy
            let reachable_states = [];
            if (state[0] == 0 && state[1] == 0 || state[0] == 3 && state[1] == 3) {
                // if we are in a terminal state, there is no way to get out
                reachable_states.push([0,0]);
            } else {

                // consider alle states if we got up, down, left, right from this state
                // we have to stay in the same state when we reach the wall
                reachable_states.push([Math.max(state[0] - 1, 0), state[1]]); // left
                reachable_states.push([Math.min(state[0] + 1, 3), state[1]]); // right
                reachable_states.push([state[0], Math.max(state[1] - 1, 0)]); // up
                reachable_states.push([state[0], Math.min(state[1] + 1, 3)]); // down
            }
            return reachable_states;
        },
        reward: (state, action) => (state[0] == 0 && state[1] == 0 || state[0] == 3 && state[1] == 3) ? 0 : -1
    }

    doPolicyEvaluation(mdp, value_function) {
        let new_value_function = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

        // for all states
        for (let i = 0;  i <= 3; i++) {
            for (let j = 0; j <= 3; j ++) {

                let state = [i,j];

                let new_value = 0;

                let actions = mdp.action(state);

                for (let action of  actions) {

                    // get the reward for the state transition
                    let reward = mdp.reward(state, action)
                    
                    let state_prime_value = value_function[action[0]][action[1]];

                    // calculate the value of state by adding the reward for the transition plus the cached value from the next state
                    new_value += (reward + state_prime_value) * 0.25;
                    //console.log("BAUM STATE " + state + " REWARD " + reward + " VALUE "+ state_prime_value + " ACTION " + action + " NEW " + (reward + state_prime_value) * 0.25);   
                }
                new_value_function[state[0]][state[1]] = new_value;
            }
        }

        return new_value_function;
    }

    doValueEvaluation(mdp, value_function) {
        let new_value_function = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

        // for all states
        for (let i = 0;  i <= 3; i++) {
            for (let j = 0; j <= 3; j ++) {

                let state = [i,j];

                let new_value;

                let actions = mdp.action(state);

                for (let action of  actions) {

                    // get the reward for the state transition
                    let reward = mdp.reward(state, action)
                    
                    let state_prime_value = value_function[action[0]][action[1]];

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