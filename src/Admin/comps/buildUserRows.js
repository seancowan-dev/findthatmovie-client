import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { Button } from 'semantic-ui-react';
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
        <Button 
                circular
                icon='user delete'
                onClick={(e) => {
                UserStore.adminDeleteUserModalVisibility = true;
                UserStore.setCurrentlyDeletingUserId(user.id);
            }}/>
        </TableCell>                                   
    </TableRow>
    });
}