import React from 'react';
import { observer, inject } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, ExpansionPanel, ExpansionPanelSummary, FormHelperText, FormControl, ExpansionPanelDetails, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField }  from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Message } from 'semantic-ui-react';
import $ from 'jquery';
import uuid from 'uuid';
import ListsService from '../../services/lists-service';
import './panel.css';

const useStyles = makeStyles((theme) => ({
    panelContainer: {
        backgroundColor: "#90849E",
        color: "#c7c7c7"
    },
    tableContainer: {
        position: "relative",
        backgroundColor: "#22252c",
        color: "#c7c7c7"
    }
  }));

const Panel = inject('userStore', 'helpers')(observer((props) => {
    const classes = useStyles();
    async function deleteListItems(id) {
        await ListsService.deleteListItem(id).then(res => {
            props.userStore.toggleListLoaded(false);
        })
    }

    async function deleteUserList(id) {
        await ListsService.deleteUserList(id).then(res => {
            props.userStore.toggleListLoaded(false);
        })
    }

    async function addUserList(newList) {
        await ListsService.addUserList(newList).then(res => {
            props.userStore.toggleListLoaded(false);
        })
    }

    function buildList(userInput) {
        return {
            "list_name": userInput,
            "user_id": props.userStore.getUserId,
        }
    }

    const logExpanded = () => {
        let listsClasses = $('.user-list-header');
        let expandedPanels = [];
        for (let i = 0; i < listsClasses.length; i++) {
            expandedPanels.push({
                    expanded: listsClasses[i].className.includes("Mui-expanded") === true ? true : false,
                    id: listsClasses[i].id
            })
        }
        return expandedPanels;
    }

    const handleExpanded = (historyArr, id) => {
        let found = historyArr.find(item => {
            return item.id === id ? true : false;
        })
        return found;
    }

    let pane = props.list_data.map((listData, idx) => {

        let items;
        let expand_check = false; 
        if (listData.items !== false) {
            items = listData.items.map(row => {
                return  <TableRow 
                            key={uuid.v4()}
                            id={row.item_id}
                        >
                    <TableCell
                        key={uuid.v4()} 
                        component="th" 
                        scope="row"
                    >
                        {row.title}
                    </TableCell>
                    <TableCell 
                        key={uuid.v4()}
                    >
                        {row.date_added}
                    </TableCell>
                    <TableCell
                        id={row.item_id}
                        className={"action-cell-" + row.item_id}
                        key={uuid.v4()} 
                        align="center"
                    >
                        <DeleteForeverIcon onClick={(e) => {
                            props.userStore.setExpandedHistory(logExpanded());
                            deleteListItems($(`.action-cell-${row.item_id}`).parent().attr("id"));
                        }}/>
                    </TableCell>
                </TableRow>
            });
        }

        if (props.userStore.getExpandedHistory.length > 0) {
            expand_check = handleExpanded(props.userStore.getExpandedHistory, listData.id);
        }

        return <ExpansionPanel className={classes.panelContainer} key={uuid.v4()} defaultExpanded={expand_check !== undefined ? props.userStore.getExpandedHistory.length > 0 ? expand_check.expanded : false : false}>
                    <ExpansionPanelSummary
                        className={"user-list-header"}
                        expandIcon={<ExpandMoreIcon />}
                        id={listData.id}
                        key={uuid.v4()}
                    >
                    <Typography
                        key={uuid.v4()}
                    >
                        {listData.list_name}
                    </Typography>
                    <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                        <button 
                            id={listData.id}
                            className="delete-list-button buttons comment-button"
                            type="submit"
                            onClick={(e) => {
                                props.userStore.setExpandedHistory(logExpanded()); // Set the history of expanded elems
                                deleteUserList(e.target.id); // Delete the user list item
                                props.userStore.setListMessageVisibility(); // Show the message box
                                props.userStore.setListMessage("Successfully deleted list"); // Show a message indicating that the list was deleted
                            }}
                        >Delete List</button>
                    </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails 
                        key={uuid.v4()}
                    >
                        <TableContainer
                            className={classes.tableContainer} 
                            component={Paper} 
                            key={uuid.v4()}
                        >
                        <Table 
                            aria-label="simple table" 
                            key={uuid.v4()}
                        >
                            <TableHead 
                                key={uuid.v4()}
                            >
                            <TableRow
                                key={uuid.v4()}
                            >
                                <TableCell 
                                    key={uuid.v4()}
                                >
                                    Title
                                </TableCell>
                                <TableCell 
                                    key={uuid.v4()}
                                >
                                    Added On
                                    </TableCell>
                                <TableCell 
                                    key={uuid.v4()}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                            </TableHead>
                        <TableBody 
                                key={uuid.v4()}
                        >
                            {items}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    });    
    return (
    <Container>
        <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.userStore.listMessage.visible)} content={props.userStore.listMessage.message} />
        <Grid container className="add-user-list-form-container" alignItems="flex-start" justify="flex-end" direction="row">
            <form className={props.userStore.userListInputFormVisibility}>
                <FormControl>
                    <TextField
                        className="user-list-input"
                        value={props.userStore.getUserListInput}
                        onChange={(e) => {
                            props.userStore.setUserListInput(e.target.value);
                        }}
                    />
                    <FormHelperText id="user-list-input-label">Enter List Name</FormHelperText>
                </FormControl>                       
            </form>
            <Grid className={props.userStore.addUserListToggleButtonVisibility}>
                <button 
                    className="toggle-add-list-form-button buttons comment-button"
                    type="submit"
                    onClick={(e) => {
                        props.userStore.setExpandedHistory(logExpanded());
                        props.userStore.setUserListInput("");
                        props.userStore.setUserListInputFormVisibility();
                        props.userStore.setAddUserListToggleButtonVisibility(); // Hide this button
                        props.userStore.setAddUserListButtonVisibility(); // Show the submit button to actually add the list
                    }}
                >Add List
                </button>
            </Grid>
            <Grid className={props.userStore.addUserListButtonVisibility}>
                <button 
                    className="add-list-form-button buttons comment-button"
                    type="submit"
                    onClick={(e) => {
                        props.userStore.setExpandedHistory(logExpanded()); // Set the history of expanded elems
                        addUserList(buildList(props.userStore.getUserListInput)); // Add the user list to the database
                        props.userStore.setUserListInputFormVisibility(); // Hide the input form
                        props.userStore.setAddUserListButtonVisibility(); // Hide this button
                        props.userStore.setAddUserListToggleButtonVisibility();  // Show the button to bring up the form dialog again
                        props.userStore.setListMessageVisibility(); // Show the message box
                        props.userStore.setListMessage("Successfully added list"); // Show a message indicating that the list was added
                    }}
                >Add List
                </button>
            </Grid>
        </Grid> 
        {pane}
    </Container>
    );
}));

export default Panel;