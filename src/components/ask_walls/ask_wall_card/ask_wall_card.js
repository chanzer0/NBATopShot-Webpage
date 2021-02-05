import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import { Line } from 'react-chartjs-2';

class AskWallCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moment: this.props.moment,
            momentListings: [],
            data: []
        }
    }
    componentDidMount() {
        this.getMarketData();
    }

    getMarketData() {
        fetch("https://api.nba.dapperlabs.com/marketplace/graphql?GetUserMomentListingsDedicated",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query GetUserMomentListingsDedicated($input: GetUserMomentListingsInput!) {\n  getUserMomentListings(input: $input) {\n    data {\n      circulationCount\n      flowRetired\n      version\n      set {\n        id\n        flowName\n        flowSeriesNumber\n        __typename\n      }\n      play {\n        ... on Play {\n          ...PlayDetails\n          __typename\n        }\n        __typename\n      }\n      assetPathPrefix\n      priceRange {\n        min\n        max\n        __typename\n      }\n      momentListings {\n        id\n        moment {\n          id\n          price\n          flowSerialNumber\n          owner {\n            dapperID\n            username\n            profileImageUrl\n            __typename\n          }\n          setPlay {\n            ID\n            flowRetired\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      momentListingCount\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PlayDetails on Play {\n  id\n  description\n  stats {\n    playerID\n    playerName\n    primaryPosition\n    currentTeamId\n    dateOfMoment\n    jerseyNumber\n    awayTeamName\n    awayTeamScore\n    teamAtMoment\n    homeTeamName\n    homeTeamScore\n    totalYearsExperience\n    teamAtMomentNbaId\n    height\n    weight\n    currentTeam\n    birthplace\n    birthdate\n    awayTeamNbaId\n    draftYear\n    nbaSeason\n    draftRound\n    draftSelection\n    homeTeamNbaId\n    draftTeam\n    draftTeamNbaId\n    playCategory\n    homeTeamScoresByQuarter {\n      quarterScores {\n        type\n        number\n        sequence\n        points\n        __typename\n      }\n      __typename\n    }\n    awayTeamScoresByQuarter {\n      quarterScores {\n        type\n        number\n        sequence\n        points\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  statsPlayerGameScores {\n    blocks\n    points\n    steals\n    assists\n    minutes\n    rebounds\n    turnovers\n    plusMinus\n    flagrantFouls\n    personalFouls\n    playerPosition\n    technicalFouls\n    twoPointsMade\n    blockedAttempts\n    fieldGoalsMade\n    freeThrowsMade\n    threePointsMade\n    defensiveRebounds\n    offensiveRebounds\n    pointsOffTurnovers\n    twoPointsAttempted\n    assistTurnoverRatio\n    fieldGoalsAttempted\n    freeThrowsAttempted\n    twoPointsPercentage\n    fieldGoalsPercentage\n    freeThrowsPercentage\n    threePointsAttempted\n    threePointsPercentage\n    __typename\n  }\n  statsPlayerSeasonAverageScores {\n    minutes\n    blocks\n    points\n    steals\n    assists\n    rebounds\n    turnovers\n    plusMinus\n    flagrantFouls\n    personalFouls\n    technicalFouls\n    twoPointsMade\n    blockedAttempts\n    fieldGoalsMade\n    freeThrowsMade\n    threePointsMade\n    defensiveRebounds\n    offensiveRebounds\n    pointsOffTurnovers\n    twoPointsAttempted\n    assistTurnoverRatio\n    fieldGoalsAttempted\n    freeThrowsAttempted\n    twoPointsPercentage\n    fieldGoalsPercentage\n    freeThrowsPercentage\n    threePointsAttempted\n    threePointsPercentage\n    __typename\n  }\n  __typename\n}\n`,
                    variables: {
                        input: {
                            setID: this.state.moment.set.id,
                            playID: this.state.moment.play.id
                        }
                    },
                    operationName: "GetUserMomentListingsDedicated"
                })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({ momentListings: data.data.getUserMomentListings.data.momentListings }, this.buildChart);
            });
    }

    render() {
        return (
            <Card
                bg={'dark'}
                key={this.state.moment.id}
                text={'white'}
                style={{ width: '100%' }}
                className="mb-3" >
                <Card.Header>{this.state.moment.play.stats.playerName} ({this.state.moment.set.flowName} Series {this.state.moment.set.flowSeriesNumber})</Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm="4">
                            <Card.Text>
                                {this.state.moment.play.description}
                            </Card.Text>
                        </Col>
                        <Col sm="8">
                            <Line data={this.state.data} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
    buildChart() {
        var dataPoints = {};
        var sortedListings = this.state.momentListings.sort((a, b) => a.price > b.price);
        var count = 0;
        sortedListings.forEach(listing => {
            dataPoints[Math.floor(listing.moment.price)] = ++count;
        });
        var chartData = [];
        Object.keys(dataPoints).forEach((key) => {
            chartData.push({ x: key, y: dataPoints[key] });
        });
        console.log(this.state.moment.play.stats.playerName);
        console.log(chartData);
        this.setState({ data: chartData });
    }
}

export default AskWallCard;