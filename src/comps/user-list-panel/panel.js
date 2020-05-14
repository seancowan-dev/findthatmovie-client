import React from 'react';
import { observer, inject } from 'mobx-react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField }  from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import $ from 'jquery';
import uuid from 'uuid';
import ListsService from '../../services/lists-service';

const serializeItem = item => ({
    date_added: item.date_added,
    id: item.id,
    title: item.title
});

const Panel = inject('userStore')(observer((props) => {
    async function deleteListItems(id) {
        await ListsService.deleteListItem(id).then(res => {
            props.userStore.toggleListLoaded(false);
        })
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
        let expanded = "";
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

        if (props.userStore.getExpandedHistory.length > 0 === true) {
            expand_check = handleExpanded(props.userStore.getExpandedHistory, listData.id);
        }

        return <ExpansionPanel key={uuid.v4()} defaultExpanded={props.userStore.getExpandedHistory.length > 0 === true ? expand_check.expanded : false}>
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
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails 
                        key={uuid.v4()}
                    >
                        <TableContainer 
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
    return pane;
}));

export default Panel;