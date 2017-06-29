import React from 'react';

// init gridworld
function DynamicProgramming() {
  return (
    <div className="DynamicProgramming">
        <h1>DynamicProgramming with gridworld example</h1>
        <p>{doIterativePolicyEvaluation(mdp)}</p>
    </div>
    );
}


let mdp = {
    environment: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0], //size 16
    action: [-4,1,4,-1], // up, right, bottom, left
    reward: (state, action) => (state == 0 || state == 15) ? 0 : -1
}

function doIterativePolicyEvaluation(mdp) {

    let value_function = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    // at each iteration k + 1
    for (let k = 0; k < 7; k++) {
        console.log("Iteration: " + k + " Current Value function " + value_function);
        value_function = doPolicyEvaluation(mdp, value_function);
    }
    return value_function;
}

function doPolicyEvaluation(mdp, value_function) {
    let new_value_function = value_function.slice(0);

        // for all states s
        for (let state_index = 0;  state_index < mdp.environment.length; state_index++) {

            let old_value = value_function[state_index];

            let new_value = 0;

            if (mdp.environment[state_index] == 0) {
                // exit if we are in a terminal state we do not have any action and get 0 reward
                new_value = 0;
            } else {
                // update v_k+1(s) from v_k(s'), where s' is a successor of s
                let environment_length = mdp.environment.length;
                let action_length = mdp.action.length;

                for (let action of  mdp.action) {

                    // get the reward for the state transition
                    let reward = mdp.reward(state_index, action)
        
                    let state_index_prime = state_index;
                    if ((state_index + action < environment_length) && (state_index + action >= 0)) {
                        // we are in a new state
                        state_index_prime = state_index + action;
                    }
                    let state_prime_value = value_function[state_index_prime];

                    // calculate the value of state by adding the reward for the transition plus the cached value from the next state
                    new_value += (reward + state_prime_value) * 0.25;
                }
            }

            new_value_function[state_index] = new_value;
        }

    return new_value_function;
}

export default DynamicProgramming;