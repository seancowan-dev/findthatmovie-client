import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import UserStore from '../../stores/UserStore';

export default function buildUserRows(input) {
    return input.map(user => {
        return <TableRow key={Math.random()}>
        <TableCell key={Math.random()}>{user.name}</TableCell>                      
        <TableCell key={Math.random()}>
        <button 
                className="buttons comment-button"
                onClick={(e) => {
                UserStore.adminDeleteUserModalVisibility = true;
                UserStore.setCurrentlyDeletingUserId(user.id);
            }}>Delete</button>
        </TableCell>                                   
    </TableRow>
    });
}