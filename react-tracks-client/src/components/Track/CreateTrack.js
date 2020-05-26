import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Mutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import axios from 'axios';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import {GET_TRACKS_QUERY} from "../../pages/App";

const CreateTrack = ({classes}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fileError, setFileError] = useState("");
    // const [open, setOpen] = useState(false);

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

    const handleSubmit = async (event, createTrack) => {
        event.preventDefault();
        setSubmitting(true);
        const uploadedUrl = await handleAudioUpload();
        createTrack({variables: {title, description, url: uploadedUrl}});
    };

    const handleAudioChange = event => {
        const uploadingFile = event.target.files[0];
        const fileSize = 10000000;
        if (uploadingFile && fileSize < uploadingFile.size) {
            setFileError(`${uploadingFile.name} greater than 10MB`);
        } else {
            setFileError('');
            setFile(event.target.files[0]);
        }
    };


    return (<>
            <Button onClick={() => setOpen(true)} variant='fab' className={classes.fab} color='secondary'>
                {!open ? <AddIcon/> : <ClearIcon/>}
            </Button>
            <Mutation
                mutation={CREATE_TRACK_MUTATION}
                onCompleted={
                    data => {
                        console.log(data);
                        setSubmitting(false);
                        setOpen(false);
                    }
                }
                refetchQueries={() => [{query: GET_TRACKS_QUERY}]}
            >
                {
                    (createTrack, {loading, error}) => {

                        if (error) return <Error error={error}/>;
                        if (loading) return <Loading/>;

                        return (<Dialog open={open} onClose={() => setOpen(false)} className={classes.dialog}>
                            <form onSubmit={event => handleSubmit(event, createTrack)}>
                                <DialogTitle>
                                    Create Dialog
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Add a Title, Description & Audio File
                                    </DialogContentText>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Title'
                                            placeholder='Add Title'
                                            className={classes.textField}
                                            onChange={event => setTitle(event.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField
                                            multiline
                                            rows='4'
                                            label='Description'
                                            placeholder='Add Description'
                                            onChange={event => setDescription(event.target.value)}
                                            className={classes.textField}/>
                                    </FormControl>
                                    <FormControl error={Boolean(fileError)}>
                                        <input
                                            required
                                            type='file'
                                            id='audio'
                                            className={classes.input}
                                            accept='audio/mp3, audio/wav'
                                            size="10000"
                                            onChange={event => handleAudioChange(event)}
                                        />
                                        <label htmlFor='audio'>
                                            <Button
                                                variant='outlined'
                                                color='inherit'
                                                component='span'
                                                className={classes.button}
                                            >
                                                Audio file
                                                <LibraryMusicIcon className={classes.icon}/>
                                            </Button>
                                            {file && file.name}
                                            <FormHelperText> {fileError} </FormHelperText>
                                        </label>
                                    </FormControl>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} className={classes.cancel}>
                                        Cancel
                                    </Button>
                                    <Button disabled={ fileError || submitting || !title.trim() || !description.trim() || !file} type='submit' className={classes.save}>
                                        {submitting ? <CircularProgress className={classes.save} size={24}/> : 'Add audio' }
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>)
                    }
                }
            </Mutation>

        </>

    );
};

const CREATE_TRACK_MUTATION = gql`
    mutation($title: String!, $description: String!, $url: String!){
        createTrack(title: $title, description: $description, url: $url){
            track{
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
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        zIndex: "200"
    }
});

export default withStyles(styles)(CreateTrack);
