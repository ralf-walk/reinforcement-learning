import React from 'react';
import TicTacToe from "./tic-tac-toe";
import QLearning from "../q_learning";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import Container from "react-bootstrap/Container";
import {Card, Row} from "react-bootstrap";
import Col from "react-bootstrap/es/Col";
import Cross from "./cross.png";
import Circle from "./circle.png";

class TicTacToeComponent extends React.Component {

    game = new TicTacToe();
    qLearning = new QLearning(this.game);

    ui = {
        chart_data: [],
        state: [1, 2, 1, 2, 2, 2, 1, 2, 1],
        player1won: 0,
        player2won: 0,
        draw: 0,
        qtablesize: 0,
        episodes: 0,
        train: false,
        explore: true
    };

    cssImg = {
        width: '1rem'
    };

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.startTraning = this.startTraning.bind(this);
        this.stopTraining = this.stopTraining.bind(this);
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    <Container mclassName="p-3">
                        <Row className="justify-content-center">
                            <Col>
                                <h4>Tic Tac Toe</h4>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body>
                    <Container mclassName="p-3">
                        <Row className="justify-content-center mt-3">
                            <Col>
                                <this.uiGetBoard ui={this.ui}/>
                            </Col>
                            <Col>

                                <button onClick={() => {
                                    if (!this.ui.train) {
                                        this.ui.train = true;
                                        this.startTraning();
                                    } else {
                                        this.stopTraining();
                                    }
                                }}>
                                    Start/Stop Training
                                </button>

                                <ul>
                                    <li><img style={this.cssImg} src={Cross} alt="Cross"/> q-learning
                                        wins: {this.ui.player1won}</li>
                                    <li><img style={this.cssImg} src={Circle} alt="Circle"/> random
                                        wins: {this.ui.player2won}</li>
                                    <li>Draw Games: {this.ui.draw}</li>
                                    <li>Q Table Size: {this.ui.qtablesize}</li>
                                    <li>{this.ui.explore ? "Exploring with 0.5..." : "Exploiting"}</li>
                                </ul>

                                <button onClick={() => {
                                    this.ui.explore = !this.ui.explore;
                                }}>
                                    {this.ui.explore ? "Exploit" : "Explore"}
                                </button>
                            </Col>
                        </Row>

                        <Row className="justify-content-center mt-3">
                            <Col>
                                <LineChart width={600} height={300} data={this.ui.chart_data}>
                                    <Line type="monotone" dataKey="loses" stroke="#82ca9d"/>
                                    <CartesianGrid stroke="#ccc"/>
                                    <Tooltip/>
                                    <Legend/>
                                    <XAxis dataKey="episodes"/>
                                    <YAxis/>
                                </LineChart>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        )
    }

    uiGetBoard(props) {
        const ui = props.ui;

        const cssImg = {
            width: '1rem'
        };

        const getImage = (player) => {
            if (player == 1) {
                return <img style={cssImg} src={Cross} alt="Cross"/>;
            } else if (player == 2) {
                return <img style={cssImg} src={Circle} alt="Circle"/>;
            }
            return <div/>
        };

        return (
            <table>
                <tr>
                    <td>{getImage(ui.state[0])}</td>
                    <td>{getImage(ui.state[1])}</td>
                    <td>{getImage(ui.state[2])}</td>
                </tr>
                <tr>
                    <td>{getImage(ui.state[3])}</td>
                    <td>{getImage(ui.state[4])}</td>
                    <td>{getImage(ui.state[5])}</td>
                </tr>
                <tr>
                    <td>{getImage(ui.state[6])}</td>
                    <td>{getImage(ui.state[7])}</td>
                    <td>{getImage(ui.state[8])}</td>
                </tr>
            </table>
        );
    }

    startTraning() {
        setTimeout(() => {
            for (let episode = 0; episode < 1000; episode++) {
                const lastState = this.qLearning.do_q_learning(this.ui.explore ? 0.5 : 0);

                this.ui.state = lastState;
                this.ui.player1won += this.game.isWon(lastState);
                this.ui.player2won += this.game.isLost(lastState);
                this.ui.draw += this.game.isDraw(lastState);
                this.ui.qtablesize = Object.keys(this.qLearning.q_table).length;
                this.ui.episodes++;
            }

            const chartData = this.ui.chart_data.slice(0);
            const losesPercent = (this.ui.player2won + this.ui.draw) / this.ui.episodes;
            chartData.push({episodes: this.ui.episodes, loses: losesPercent});
            this.ui.chart_data = chartData;
            this.forceUpdate();
            if (this.ui.train) {
                this.startTraning();
            }
        }, 100);
    }

    stopTraining() {
        this.ui.train = false;
    }
}

export default TicTacToeComponent;