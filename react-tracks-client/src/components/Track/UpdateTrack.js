import React, {useState, useContext} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import {Mutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import axios from 'axios';
import {GET_TRACKS_QUERY} from "../../pages/App";
import {UserContext} from "../../Root";

const UpdateTrack = ({classes, track}) => {
    const currentUser = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(track.title);
    const [description, setDescription] = useState(track.description);
    let [url, setUrl] = useState(track.url);
    const [file, setFile] = useState('');
    const [fileError, setFileError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isCurrentUser = track.postedBy.id === currentUser.id;

    const handleSubmit = async (event, updateTrack) => {
        event.preventDefault();
        setSubmitting(true);
        if (file) {
            const newUrl = await handleAudioUpload();
            console.log(newUrl);
            url = newUrl;
            console.log(url);
        }
        updateTrack({
            variables: {
                trackId: track.id,
                title,
                description,
                url
            }
        });
    };

    const handleAudioUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('resource_type', 'raw');
            formData.append('upload_preset', 'react-tracks');
            formData.append('cloud_name', 'du29fcsw3');
            const res = await axios.post('https://api.cloudinary.com/v1_1/du29fcsw3/raw/upload', formData);
            console.log(res);
            return res.data.url;
        } catch (e) {
            console.error("Error uploading file", e);
            setSubmitting(false);
        }
    };


    const handleAudioChange = (event) => {
        const selectedFile = event.target.files[0];
        const limit = 10000000;
        if (selectedFile && limit < selectedFile.size) {
            setFileError("so big file");
        } else {
            setFileError('');
            setFile(selectedFile);
        }
    };

    return isCurrentUser && (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <EditIcon/>
            </IconButton>

            <Mutation mutation={UPDATE_TRACK}
                onCompleted={() => {
                    setSubmitting(false);
                    setOpen(false);
                }}
                >
                {
                    (updateTrack, {loading, error}) => (

                        <Dialog open={open} onClose={() => setOpen(false)} className={classes.dialog}>
                            <form onSubmit={(event) => {
                                handleSubmit(event, updateTrack)
                            }}>
                                <DialogTitle>
                                    Update Dialog
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Update track information
                                    </DialogContentText>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Edit title'
                                            required
                                            onChange={event => setTitle(event.target.value)}
                                            placeholder="Edit title"
                                            value={title}
                                            name="title"
                                            className={classes.textField}/>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            onChange={event => setDescription(event.target.value)}
                                            multiline
                                            rows="4"
                                            label='Edit description'
                                            className={classes.textField}
                                            value={description}
                                            name="description"
                                            placeholder="Edit description"/>
                                    </FormControl>
                                    <FormControl fullWidth error={Boolean(fileError)}>
                                        <input
                                            type='file'
                                            id='audio'
                                            onChange={event => handleAudioChange(event)}
                                            name='file'
                                            className={classes.input}
                                            accept='audio/mp3, audio/wav'
                                        />
                                        <label htmlFor='audio'>
                                            <Button
                                                variant='outlined'
                                                color='inherit'
                                                component='span'
                                                className={classes.button}>
                                                Audio file
                                                <LibraryMusicIcon className={classes.icon}/>
                                            </Button>
                                            <FormHelperText>
                                                {fileError}
                                            </FormHelperText>
                                        </label>
                                    </FormControl>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} className={classes.cancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit' className={classes.save}>
                                        {submitting
                                            ? <CircularProgress className={classes.save} size={24}/>
                                            : 'Update track'}
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                    )
                }
            </Mutation>
        </>

    );
};

const UPDATE_TRACK = gql`
    mutation($trackId: ID!, $title: String!, $description: String!, $url: String!){
        updateTrack(trackId: $trackId, title: $title, description: $description, url: $url) {
            track {
                id
                title
                description
                url
            }
        }
    }
`;

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    dialog: {
        margin: "0 auto",
        maxWidth: 550
    },
    textField: {
        margin: theme.spacing.unit
    },
    cancel: {
        color: "red"
    },
    save: {
        color: "green"
    },
    button: {
        margin: theme.spacing.unit * 2
    },
    icon: {
        marginLeft: theme.spacing.unit
    },
    input: {
        display: "none"
    }
});

export default withStyles(styles)(UpdateTrack);
