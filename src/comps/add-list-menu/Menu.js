import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { observer, inject } from 'mobx-react';
import ListsService from '../../services/lists-service';
import uuid from 'uuid';

const AddMenu = inject('userStore', 'searchStore')(observer((props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function addToList(item) {
    await ListsService.addListItem(item).then(res => {
        props.userStore.toggleListLoaded(false);
    })
  }

  let menuItems;

  if (props.userStore.getAuthenticated === true) { // Only authenticated users can add to lists
    menuItems =props.list_data.map((listData, idx) => { // Map the user's lists as menu items
      return (
          <MenuItem key={uuid.v4()} id={listData.id} onClick={(e) => { 
            let date = + new Date(); // Get current datetime
            let listItem = { // Make list item
              "title": props.searchStore.getOriginalTitle, // Get movie title
              "date_added": new Date(date).toISOString(), // Set datetime as timestamptz
              "list_id": e.target.id, // Get the id of the list the user wishes to add to
            }
              addToList(listItem); // Add the list item to the database
              props.searchStore.setAddListVisibility(); // Show the message dialog for the user
              props.searchStore.setAddListMessage(`Successfully added ${props.searchStore.getOriginalTitle} to your list: ${listData.list_name}`);
              handleClose(); // Close this menu
          }}>
              {listData.list_name}
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