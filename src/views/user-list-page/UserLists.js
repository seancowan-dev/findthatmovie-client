import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }  from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import uuid from 'uuid';
import './UserLists.css';

const serializeItem = item => ({
    date_added: item.date_added,
    id: item.id,
    title: item.title
});

const UserLists = inject('userStore')(observer((props) => {
    let list_data = [];
    let list_items = [];
    for (let [key, value] of Object.entries(props.userStore.userLists)) {
        let items = [];
        let list = {
            name: "",
            id: key
        }
        value.forEach(item => {
            list.name = item.list_name;
            items.push(serializeItem(item))
        });
        list_items.push(items);
        list_data.push(list);
    }

    let panel = list_data.map((listData, idx) => {
        return <ExpansionPanel key={uuid.v4()}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={listData.id}
                    key={uuid.v4()}
                    >
                    <Typography key={uuid.v4()}>{listData.name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails key={uuid.v4()}>
                        <TableContainer component={Paper} key={uuid.v4()}>
                        <Table aria-label="simple table" key={uuid.v4()}>
                            <TableHead key={uuid.v4()}>
                            <TableRow key={uuid.v4()}>
                                <TableCell key={uuid.v4()}>Title</TableCell>
                                <TableCell key={uuid.v4()}>Added On</TableCell>
                                <TableCell key={uuid.v4()}>Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody key={uuid.v4()}>
                            {list_items[idx].map((row) => (
                                <TableRow key={uuid.v4()}>
                                    <TableCell key={uuid.v4()} component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                    <TableCell key={uuid.v4()}>{row.date_added}</TableCell>
                                    <TableCell key={uuid.v4()} align="center"><DeleteForeverIcon/></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
    })

    if (props.userStore.loaded === true) {
        return <>
            <Nav />
            <div className="list-container">
                <h1>{props.userStore.authenticatedUser + "'s Lists"}</h1>
                {panel}
                {/* <ExpansionPanel>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={list_data[0].id}
                    >
                    <Typography>{list_data[0].name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">Added On</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {list_items[0].map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                    <TableCell align="right">{row.date_added}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </ExpansionPanelDetails>
                </ExpansionPanel> */}
            </div>
        </>
    }
}));

export default UserLists;