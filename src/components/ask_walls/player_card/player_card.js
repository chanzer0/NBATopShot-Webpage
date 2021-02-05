import React, { Component } from "react";
import Card from "react-bootstrap/Card";


class PlayerCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moment: this.props.moment
        }
        this.getMarketData();
    }

    getMarketData() {
        console.log(this.state.moment);
    }

    render() {
        return (
            <Card
                bg={'dark'}
                key={this.state.moment.id}
                text={'white'}
                style={{ width: '22rem' }}
                className="mb-3" >
                <Card.Header>{this.state.moment.set.flowName} - Series {this.state.moment.set.flowSeriesNumber}</Card.Header>
                <Card.Body>
                    <Card.Title>{this.state.moment.play.stats.playerName}</Card.Title>
                    <Card.Text>
                        {this.state.moment.play.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default PlayerCard;