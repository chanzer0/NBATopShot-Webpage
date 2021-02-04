import React, { Component, Fragment } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import Form from 'react-bootstrap/Form';


class AskWalls extends Component {
    constructor(props) {
        super(props);
        this.state = { sets: [], selectedSetName: [], selectedSetData: {}, momentsFromSet: [] };
    }

    componentDidMount() {
        this.getSets();
    }

    getSets() {
        fetch("https://api.nba.dapperlabs.com/marketplace/graphql?SearchTags",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query SearchTags($setsInput: SearchSetsInput!) {\n  allPlayers {\n    size\n    data {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  allTeams {\n    size\n    data {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  searchSets(input: $setsInput) {\n    searchSummary {\n      data {\n        ... on Sets {\n          data {\n            id\n            ... on Set {\n              flowName\n              setVisualId\n              flowSeriesNumber\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n`,
                    variables: { setsInput: {} },
                    operationName: "SearchTags"
                })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({ sets: data.data.searchSets.searchSummary.data.data });
            });
    }

    render() {
        return (
            <Fragment>
                <Form.Group>
                    <Typeahead
                        id="basic-typeahead-single"
                        labelKey="name"
                        onChange={this.setSelectedSet}
                        options={this.state.sets.map(set => { return set.flowName + " - Series " + set.flowSeriesNumber; })}
                        selected={this.state.selectedSetName[0]}
                        placeholder="Choose a set..."
                    />
                </Form.Group>

                {this.state.momentsFromSet.map(moment => (
                    <p key={moment.id}>{moment.play.stats.playerName} - {moment.play.description}</p>
                ))}
            </Fragment>
        );
    }

    setSelectedSet = selected => {
        if (selected.length !== 0) {
            const setName = selected[0].split(" - ")[0];
            const selectedSet = this.state.sets.find(set => set.flowName === setName);
            this.setState({ selectedSetData: selectedSet }, this.loadSetData);
        }
    }

    loadSetData() {
        fetch("https://api.nba.dapperlabs.com/marketplace/graphql?SearchTags",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query SearchMomentListingsDefault($byPlayers: [ID], $byTagNames: [String!], $byTeams: [ID], $byPrice: PriceRangeFilterInput, $orderBy: MomentListingSortType, $byGameDate: DateRangeFilterInput, $byCreatedAt: DateRangeFilterInput, $byListingType: [MomentListingType], $bySets: [ID], $bySeries: [ID], $bySetVisuals: [VisualIdType], $byPrimaryPlayerPosition: [PlayerPosition], $bySerialNumber: IntegerRangeFilterInput, $searchInput: BaseSearchInput!, $userDapperID: ID) {\n  searchMomentListings(input: {filters: {byPlayers: $byPlayers, byTagNames: $byTagNames, byGameDate: $byGameDate, byCreatedAt: $byCreatedAt, byTeams: $byTeams, byPrice: $byPrice, byListingType: $byListingType, byPrimaryPlayerPosition: $byPrimaryPlayerPosition, bySets: $bySets, bySeries: $bySeries, bySetVisuals: $bySetVisuals, bySerialNumber: $bySerialNumber}, sortBy: $orderBy, searchInput: $searchInput, userDapperID: $userDapperID}) {\n    data {\n      filters {\n        byPlayers\n        byTagNames\n        byTeams\n        byPrimaryPlayerPosition\n        byGameDate {\n          start\n          end\n          __typename\n        }\n        byCreatedAt {\n          start\n          end\n          __typename\n        }\n        byPrice {\n          min\n          max\n          __typename\n        }\n        bySerialNumber {\n          min\n          max\n          __typename\n        }\n        bySets\n        bySeries\n        bySetVisuals\n        __typename\n      }\n      searchSummary {\n        count {\n          count\n          __typename\n        }\n        pagination {\n          leftCursor\n          rightCursor\n          __typename\n        }\n        data {\n          ... on MomentListings {\n            size\n            data {\n              ... on MomentListing {\n                id\n                version\n                circulationCount\n                flowRetired\n                set {\n                  id\n                  flowName\n                  setVisualId\n                  flowSeriesNumber\n                  __typename\n                }\n                play {\n                  description\n                  id\n                  stats {\n                    playerName\n                    dateOfMoment\n                    playCategory\n                    teamAtMomentNbaId\n                    teamAtMoment\n                    __typename\n                  }\n                  __typename\n                }\n                assetPathPrefix\n                priceRange {\n                  min\n                  max\n                  __typename\n                }\n                momentListingCount\n                listingType\n                userOwnedSetPlayCount\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n`,
                    variables: {
                        bySets: [this.state.selectedSetData.id],
                        searchInput: {
                            pagination: {
                                limit: 9999,
                                cursor: '',
                                direction: 'RIGHT'
                            }
                        }
                    },
                    operationName: "SearchMomentListingsDefault"
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.data.searchMomentListings.data.searchSummary.data.data);
                this.setState({ momentsFromSet: data.data.searchMomentListings.data.searchSummary.data.data })
            });
    }
}

export default AskWalls;