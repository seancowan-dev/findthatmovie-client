import React from 'react';
import { observer, inject } from 'mobx-react';
import './cast.css';

const Cast = inject('searchStore')(observer((props) => {
    let cast;

    if (props.info.cast !== undefined) {
        cast = props.info.cast.map(item => {
            return (<React.Fragment key={Math.random()}>
                <img className="cast-pictures" src={item.url} alt={item.actor + "Headshot"}/>
                <p>{item.actor}</p>
                <p>{item.character}</p>
                </React.Fragment>
            );
        });
    }
return (<div className="movie-cast-container">{cast}</div>);
}));

export default Cast;