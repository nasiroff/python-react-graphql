import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Lock from "@material-ui/icons/Lock";
import Error from "../Shared/Error";

const Login = ({classes, setNewUser}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (event, tokenAuth, client) => {
        event.preventDefault();
        const res = await tokenAuth();
        localStorage.setItem("authToken", res.data.tokenAuth.token);
        client.writeData({data: {isLoggedIn: true}});
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Lock/>
                </Avatar>
                <Typography variant="title"> Login as existing user!</Typography>
                <Mutation
                    mutation={LOGIN_MUTATION}
                    variables={{username, password}}
                >
                    {
                        (tokenAuth, {loading, error, called, client}) => {
                            return (<>
                                    <form onSubmit={(event) => handleSubmit(event, tokenAuth, client)}>
                                        <FormControl fullWidth margin="normal" required>
                                            <InputLabel htmlFor="username">
                                                Username
                                            </InputLabel>
                                            <Input id="username" type="text"
                                                   onChange={event => setUsername(event.target.value)}/>
                                        </FormControl>
                                        <FormControl fullWidth margin="normal" required>
                                            <InputLabel htmlFor="password">
                                                Password
                                            </InputLabel>
                                            <Input id="password" type="password"
                                                   onChange={event => setPassword(event.target.value)}/>
                                        </FormControl>
                                        <Button
                                            className={classes.submit}
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={error || !username.trim() || !password.trim()}
                                            color="primary"
                                        >{loading ? "Logging in..." : "Login" }</Button>
                                        <Button
                                            className={classes.submit}
                                            type="submit"
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                        >New user? Register here</Button>
                                    </form>
                                    {error && <Error error={error}/>}
                                </>
                            );
                        }
                    }
                </Mutation>
            </Paper>
        </div>
    );
};

const LOGIN_MUTATION = gql`
    mutation ($password: String!, $username: String!) {
        tokenAuth(password: $password, username: $username){
            token
        }
    }
`;

const styles = theme => ({
    root: {
        width: "auto",
        display: "block",
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up("md")]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.unit * 2
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.secondary.main
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%",
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(Login);
