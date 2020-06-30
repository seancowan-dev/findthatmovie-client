import React from 'react';
import { observer, inject } from 'mobx-react';
import './cast.css';

const Cast = inject('searchStore')(observer((props) => {
    let cast;

    if (props.info.cast !== undefined) {
        cast = props.info.cast.map((item, idx) => {
            let colorClass = {
                first: 'first-cast-color',
                second: 'second-cast-color'
            }
            let outColor;
            if (idx % 2 === 0) {
                outColor = colorClass.first;
            }
            if (idx % 2 !== 0) {
                outColor = colorClass.second;
            }
            return (<React.Fragment key={Math.random()}>
                <img className={"cast-pictures " + outColor} src={item.url} alt={item.actor + "Headshot"}/>
                <p className={outColor}>{item.actor}</p>
                <p className={outColor}>{item.character}</p>
                </React.Fragment>
            );
        });
    }
return (<div className="movie-cast-container">{cast}</div>);
}));

export default Cast;