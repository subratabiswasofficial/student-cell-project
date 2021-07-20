import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                return !isAuthenticated && !loading ? <Redirect to="/" /> : <Component {...props} />;
            }}
        />
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};
export default connect(mapStateToProps)(PrivateRoute);
