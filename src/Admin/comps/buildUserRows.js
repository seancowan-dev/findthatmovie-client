import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import UserStore from '../../stores/UserStore';

export default function buildUserRows(input) {
    return input.map(user => {
        return <TableRow key={Math.random()}>
        <TableCell component="th" scope="row" key={Math.random()}>
            {user.id}
        </TableCell>
        <TableCell key={Math.random()}>{user.name}</TableCell>
        <TableCell key={Math.random()}>{user.date_added}</TableCell>                        
        <TableCell key={Math.random()}>
        <button 
                onClick={(e) => {
                UserStore.adminDeleteUserModalVisibility = true;
                UserStore.setCurrentlyDeletingUserId(user.id);
            }}>Delete</button>
        </TableCell>                                   
    </TableRow>
    });
}