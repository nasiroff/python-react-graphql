import React, {useContext} from "react";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import {UserContext} from "../../Root";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";
import {GET_TRACKS_QUERY} from "../../pages/App";

const DeleteTrack = ({track}) => {

    const currentUser = useContext(UserContext);

    const isCurrentUser = currentUser.id === track.postedBy.id

    return isCurrentUser && (
        <Mutation
            mutation={DELETE_TRACK}
            variables={{
                trackId: track.id
            }}
            refetchQueries={() => [{query: GET_TRACKS_QUERY}]}
        >
            {
                deleteTrack => (

                    <IconButton onClick={() => deleteTrack()}>
                        <TrashIcon/>
                    </IconButton>
                )
            }
        </Mutation>
    );
};

const DELETE_TRACK = gql`
    mutation($trackId: Int!){
        deleteTrack(trackId: $trackId) {
            trackId
        }
    }
`;

export default DeleteTrack;
