import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import withRoot from "./withRoot";
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';
import App from "./pages/App";
import Profile from "./pages/Profile";
import Header from "./components/Shared/Header";
import Error from "./components/Shared/Error";
import Loading from "./components/Shared/Loading";

export const UserContext = React.createContext();

const Root = () => (
        <Query query={ME_QUERY}>
            {
                ({data, loading, error}) => {
                    if (loading) return <Loading/>;
                    if (error) return <Error error={error}/>;
                    const currentUser = data.me;
                    return (<Router>
                        <UserContext.Provider value={currentUser}>
                            <Header currentUser={currentUser}/>
                            <Switch>
                                <Route exact path="/" component={App}/>
                                <Route path="/profile/:id" component={Profile}/>
                            </Switch>
                        </UserContext.Provider>
                    </Router>);
                }
            }
        </Query>
    )
;

export const ME_QUERY = gql`
    {
        me {
            id
            username
            password
            email
            likeSet{
                track{
                    id
                }
            }
        }
    }
`;

export default withRoot(Root);
