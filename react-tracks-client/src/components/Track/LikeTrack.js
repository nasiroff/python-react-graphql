import React, {useContext} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import {Mutation} from "react-apollo";
import {gql} from 'apollo-boost';
import {ME_QUERY, UserContext} from "../../Root";

const LikeTrack = ({classes, track}) => {

    const currentUser = useContext(UserContext);
    const isLikeable = currentUser.likeSet.some(data => data.track.id === track.id);
    return (

        <Mutation
            mutation={CREATE_LIKE}
            variables={{
                trackId: track.id
            }}
            refetchQueries={() => [{query: ME_QUERY}]}
        >
            {createLike => (
                <IconButton disabled={isLikeable} className={classes.iconButton} onClick={() => createLike()}>
                    {track.likes.length}
                    <ThumbUpIcon className={classes.icon}/>
                </IconButton>
            )}

        </Mutation>

    );
};

const CREATE_LIKE = gql`
    mutation($trackId: Int!){
       createLike(trackId: $trackId){
           track{
               id
               title
               description
           }
       }

    }
`;

const styles = theme => ({
    iconButton: {
        color: "deeppink"
    },
    icon: {
        marginLeft: theme.spacing.unit / 2
    }
});

export default withStyles(styles)(LikeTrack);
