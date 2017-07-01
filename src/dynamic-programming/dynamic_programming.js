import React from 'react';

// init gridworld
function DynamicProgramming() {
  return (
    <div className="DynamicProgramming">
        <h2>Policy Evaluation</h2>
        <table> {
            doIterativePolicyEvaluation(mdp).map(function(value) {
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
            doIterativeValueEvaluation(mdp).map(function(value) {
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
    </div>
    )
}

let mdp = {
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

function doIterativePolicyEvaluation(mdp) {

    let value_function = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

    // at each iteration k + 1
    for (let k = 0; k < 2; k++) {
        console.log("Iteration: " + k + " Current Value function " + value_function);
        value_function = doPolicyEvaluation(mdp, value_function);
    }
    return value_function;
}

function doPolicyEvaluation(mdp, value_function) {
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

function doIterativeValueEvaluation(mdp) {

    let value_function = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

    // at each iteration k + 1
    for (let k = 0; k < 4; k++) {
        console.log("Iteration: " + k + " Current Value function " + value_function);
        value_function = doValueEvaluation(mdp, value_function);
    }
    console.log("VVV ", value_function)
    return value_function;
}

function doValueEvaluation(mdp, value_function) {
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

export default DynamicProgramming;