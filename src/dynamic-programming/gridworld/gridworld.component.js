import React from 'react';
import Gridworld from "./gridworld";
import QLearning from "../q_learning";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import Fire from './fire.png'
import Treasure from './treasure.png'
import Knight from './knight.jpeg'
import {Card, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/es/Col";

class GridworldComponent extends React.Component {

    game = new Gridworld();
    qLearning = new QLearning(this.game);

    ui = {
        chart_data: [],
        state: this.game.getInitialState(),
        won: 0,
        lost: 0,
        playerRow: 0,
        playerCol: 0,
        qtablesize: 0,
        episodes: 0,
        train: false,
        explore: true
    };

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.startTraining = this.startTraining.bind(this);
        this.stopTraining = this.stopTraining.bind(this);
    }

    uiGetBoard(props) {
        const ui = props.ui;

        const cssImg = {
            width: '2rem'
        };


        const getField = (value, player) => {
            return (
                <td>
                    {value === -1 && <img style={cssImg} src={Fire} alt="Fire"/>}
                    {value === 1 && <img style={cssImg} src={Treasure} alt="Treasure"/>}
                    {player && <img style={cssImg} src={Knight} alt="Knight"/>}
                </td>
            )
        };

        return (
            <table> {
                ui.state.board.map((rowValue, rowIndex) => {
                    return (
                        <tr>
                            {rowValue.map((colValue, colIndex) => {
                                const player = ui.playerRow === rowIndex && ui.playerCol === colIndex;
                                return getField(colValue, player);
                            })}
                        </tr>
                    )
                })
            }
            </table>);
    }

    render() {
        const cssImg = {
            width: '2rem'
        };

        return (
            <Card>
                <Card.Header>
                    <Container mclassName="p-3">
                        <Row className="justify-content-center">
                            <Col>
                                <h4>Gridworld</h4>
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
                                        this.startTraining();
                                    } else {
                                        this.stopTraining();
                                    }
                                }}>
                                    Start/Stop Training
                                </button>

                                <ul>
                                    <li>Won: {this.ui.won}</li>
                                    <li>Lost: {this.ui.lost}</li>
                                    <li>Position: {this.ui.playerPosition}</li>
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
                                    <Line type="monotone" dataKey="wins" stroke="#8884d8"/>
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


    startTraining() {
        setTimeout(() => {
            const lastState = this.qLearning.do_q_learning(this.ui.explore ? 0.2 : 0);

            this.ui.state = lastState;
            this.ui.won += this.game.isWon(lastState);
            this.ui.lost += this.game.isLost(lastState);
            this.ui.qtablesize = Object.keys(this.qLearning.q_table).length;
            this.ui.playerRow = lastState.playerRow;
            this.ui.playerCol = lastState.playerCol;
            this.ui.episodes++;

            const losesPercent = this.ui.lost / this.ui.episodes;

            const chartData = this.ui.chart_data.slice(0);
            chartData.push({episodes: this.ui.episodes, loses: losesPercent});
            this.ui.chart_data = chartData;

            this.forceUpdate();
            if (this.ui.train) {
                this.startTraining();
            }
        }, 100);
    }

    stopTraining() {
        this.ui.train = false;
    }
}

export default GridworldComponent;