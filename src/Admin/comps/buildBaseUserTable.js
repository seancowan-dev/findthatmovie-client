import React from 'react';
import { observer, inject } from 'mobx-react'; 
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import buildUserRows from './buildUserRows';
import DeleteUserModal from './deleteUserModal';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);


const BuildBaseTable = inject('userStore')(observer((props) => {

    return (
        <TableContainer component={Paper}>
        <Table className="user-management-table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
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
