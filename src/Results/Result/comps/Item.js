import React from 'react';
import { Container, Item } from 'semantic-ui-react';

const HeadItem = (props) => {
    return (
    <Container text className="single-movie-header-item">
        <Item.Group>
            <Item>
                <Item.Image size='small' src={props.movieHeadItem.src} />
                <Item.Content>
                    <Item.Description>
                        {props.movieHeadItem.overview}
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    </Container>
    );
};

export default HeadItem;