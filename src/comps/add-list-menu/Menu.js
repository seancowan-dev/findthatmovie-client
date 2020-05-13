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

  if (props.userStore.loginInfo.authenticated === true) {
    // const list = props.userStore.userLists.map(lists => {
    //       return lists[0].list_name;
    // })
    // console.log(list);
    let names = [];

    for (let [key, value] of Object.entries(props.userStore.userLists)) {
        let list_name = value.map(item => {
          return item.list_name;
        });
        names.push(list_name[0])
    }

    menuItems = names.map(name => {
      return (
          <MenuItem key={uuid.v4()} onClick={(e) => {
              alert('Now is when you should call the API for list items');
              handleClose();
          }}>
              {name}
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