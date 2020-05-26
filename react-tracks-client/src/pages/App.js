import React, {useState}from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';
import SearchTracks from '../components/Track/SearchTracks'
import TrackList from '../components/Track/TrackList'
import CreateTrack from '../components/Track/CreateTrack'
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";

const App = ({classes}) => {
    const [searchResult, setSearchResult] = useState([]);
    return (
        <div className={classes.container}>
            <SearchTracks setSearchResult={setSearchResult}/>
            <CreateTrack/>

            <Query query={GET_TRACKS_QUERY}>
            {
                ({data, loading, error}) => {
                    console.log(data.tracks);
                    if (error) return <Error error={error}/>;
                    if (loading) return <Loading/>;
                    return (<TrackList tracks={searchResult.length !== 0 ? searchResult : data.tracks}/>)
                }
            }
            </Query>
        </div>
    );
};

export const GET_TRACKS_QUERY = gql`
    query{
        tracks{
            id
            title
            description
            url
            postedBy {
                id
                username
                email
            }
            likes{
                user {
                    id
                    username
                    email
                }
            }
        }
    }
`;

const styles = theme => ({
    container: {
        margin: "0 auto",
        maxWidth: 960,
        padding: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(App);
