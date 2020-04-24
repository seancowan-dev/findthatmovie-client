import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { observer, inject } from 'mobx-react';
import uuid from 'uuid';

const AddMenu = inject('userStore')(observer((props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let menuItems;

  if (props.userStore.authenticated === true) {
    const list = props.userStore.tempLists.filter(item => {
        if (item.username === props.userStore.authenticatedUser) {
            return item;
        }
        return null;
    })

    menuItems = list[0].lists.map(item => {
        return (
            <MenuItem onClick={(e) => {
                alert('Now is when you should call the API for list items');
                handleClose();
            }}>
                {item.listname}
            </MenuItem>
        )
    })
  }

  
  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" color="primary" onClick={handleClick}>
        Add To List
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          {menuItems}
      </Menu>
    </div>
  );
}
));
export default AddMenu;