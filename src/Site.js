import React from 'react';
import ReactDOM from 'react-dom';
import { useRoutes } from 'hookrouter';
import Routes from './routing/Routing';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const Site = (props) => {
    const routeResult = useRoutes(Routes);

    return (
        <BrowserRouter>
            <App routes={routeResult} />
        </BrowserRouter>
    );
}

export default Site;
