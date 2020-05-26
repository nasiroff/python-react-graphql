import React, {useState, useRef} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import {ApolloConsumer} from "react-apollo";
import {gql} from 'apollo-boost';

const SearchTracks = ({classes, setSearchResult}) => {

    const [search, setSearch] = useState('');
    const inputEl = useRef();

    const handleSubmit = async (event, client) => {
        event.preventDefault();
        const res = await client.query({
            query: SEARCH_TRACK,
            variables: {
                search
            }
        });
        console.log(res.data.tracks);
        setSearchResult(res.data.tracks);
    };

    const clearSearchList = () => {
        setSearch('');
        inputEl.current.focus();
        setSearchResult([]);
    };

    return (
        <ApolloConsumer>
            {client => (
                <form onSubmit={event => handleSubmit(event, client)}>
                    <Paper className={classes.root}>
                        <IconButton onClick={() => clearSearchList()}>
                            <ClearIcon/>
                        </IconButton>
                        <TextField
                            fullWidth
                            placeholder='Search all text'
                            InputProps={{
                                disableUnderline: true
                            }}
                            onChange={(event) => {
                                setSearch(event.target.value)
                            }}
                            value={search}
                            inputRef={inputEl}
                        />
                        <IconButton type='submit'>
                            <SearchIcon/>
                        </IconButton>
                    </Paper>
                </form>
            )}

        </ApolloConsumer>
    );
};

const SEARCH_TRACK = gql`
    query($search: String){
        tracks(search: $search){
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
    root: {
        padding: "2px 4px",
        margin: theme.spacing.unit,
        display: "flex",
        alignItems: "center"
    }
});

export default withStyles(styles)(SearchTracks);
