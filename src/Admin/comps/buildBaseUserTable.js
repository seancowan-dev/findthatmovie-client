import React from 'react';
import { observer, inject } from 'mobx-react'; 
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import buildUserRows from './buildUserRows';
import DeleteUserModal from './deleteUserModal';

const useStyles = makeStyles({
    table: {
        marginLeft: 10,
        marginRight: 10
    },
  });


const BuildBaseTable = inject('userStore')(observer((props) => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.table} component={Paper}>
        <Table className="folder-note-list-table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Date Added</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {buildUserRows(props.userStore.adminUserList)}
                </TableBody>
            </Table>
            <DeleteUserModal />
        </TableContainer>
        
    );
}));
export default BuildBaseTable;
