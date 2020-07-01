import React from 'react';
import { observer, inject } from 'mobx-react'; 
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, ExpansionPanelDetails } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import buildUserRows from './buildUserRows';
import DeleteUserModal from './deleteUserModal';
import uuid from 'uuid';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#90849E",
      color: "#c7c7c7",
    },
    body: {
      fontSize: 14,
    },
    backgroundColor: "#90849E",
    color: "#c7c7c7",
    table: {
        paddingLeft: "24px",
        paddingRight: "24px"
    }
  }))(TableCell);

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

const BuildBaseTable = inject('userStore')(observer((props) => {
    const classes = useStyles();

    return (
        <ExpansionPanelDetails 
        key={uuid.v4()}
        >
            <TableContainer className={classes.tableContainer} component={Paper}>
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
        </ExpansionPanelDetails>
    );
}));
export default BuildBaseTable;
