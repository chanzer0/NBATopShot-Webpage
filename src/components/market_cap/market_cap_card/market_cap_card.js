import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Table from 'react-bootstrap/Table';

class MarketCapCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card
                bg={'dark'}
                key={this.props.player.id}
                text={'white'}
                style={{ width: '100%' }}
                className="mb-3" >
                <Card.Header>{this.props.player.name} Market Cap</Card.Header>
                <Card.Body>
                    <Table striped bordered hover variant="dark" style={{borderRadius: '5px'}}>
                        <thead>
                            <tr>
                                <th>Moment</th>
                                <th>Lowest Ask</th>
                                <th>Supply</th>
                                <th>Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.moments.map(moment => {
                                return <tr key={moment.id}>
                                    <td>{moment.set.flowName} - Series {moment.set.flowSeriesNumber}</td>
                                    <td>${this.addCommasToNumber(Math.floor(moment.priceRange.min))}</td>
                                    <td>{this.addCommasToNumber(moment.circulationCount)}</td>
                                    <td>${this.addCommasToNumber((+moment.priceRange.min * +moment.circulationCount).toFixed(2))}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        )
    }
    addCommasToNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default MarketCapCard;