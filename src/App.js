import React, {Component} from 'react';
import './App.css';
import GridworldComponent from "./dynamic-programming/gridworld/gridworld.component";
import TicTacToeComponent from "./dynamic-programming/tictactoe/tic-tac-toe.component";
import {Jumbotron, Row} from "react-bootstrap";
import Col from "react-bootstrap/es/Col";
import Container from "react-bootstrap/Container";

class App extends Component {
    render() {
        return (
            <>
                <Jumbotron>
                    <h2>Q-learning examples</h2>
                    <p>
                        This page is about training some games using the same Q-learning algorithm. It uses
                        a q-table to store the state, action -> reward space. The complete code is available at:
                        <br/>

                        <a href="https://github.com/ralf-walk/reinforcement-learning">https://github.com/ralf-walk/reinforcement-learning</a>
                        <br/><br/>

                        See also:
                        <br/>
                        <a href="https://en.wikipedia.org/wiki/Q-learning"> https://en.wikipedia.org/wiki/Q-learning</a>
                    </p>
                </Jumbotron>
                <Container>
                    <Row className="justify-content-center mt-3">
                        <Col xs={12} md={10}>
                            <GridworldComponent/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center mt-3">
                        <Col xs={12} md={10}>
                            <TicTacToeComponent/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default App;
