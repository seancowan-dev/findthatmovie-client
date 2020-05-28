import React from 'react'
import { observer, inject } from 'mobx-react';
import { Modal } from 'semantic-ui-react'
import UsersService from '../../services/users-service';
import '../semantic.css';

const DeleteUserModal = inject('userStore')(observer((props) => {
    const onClose = () => {
        props.userStore.adminDeleteUserModalVisibility = false
    } 
    async function deleteThisUser(id) {
        await UsersService.deleteUser(id).then(res => {
            props.userStore.setAdminUserList(null)
        });
    }
  return (
    <Modal
    size="mini"
    open={props.userStore.adminDeleteUserModalVisibility}
    onClose={onClose}>
        <Modal.Header>Confirm User Delete</Modal.Header>
        <Modal.Content>
        <Modal.Description>
            <p>You are about to delete a user are you sure you want to do this?</p>
            <button 
                onClick={(e) => {
                    props.userStore.adminDeleteUserModalVisibility = false; // Hide this modal
                    deleteThisUser(props.userStore.getCurrentlyDeletingUserId); // Delete the user
                    props.userStore.setAdminPanelMessageVisibility(); // Show the confirmation message dialog
                    props.userStore.setAdminPanelMessage("Successfully deleted the specified user"); // Set the success message
                    setTimeout(() => { // After 5 seconds hide the message again.
                        props.userStore.setAdminPanelMessageVisibility()
                    }, 5000);  
            }}>Yes
            </button>
            <button 
                onClick={(e) => {
                    props.userStore.adminDeleteUserModalVisibility = false; // Hide this modal
                    props.userStore.setAdminPanelMessageVisibility(); // Delete the user
                    props.userStore.setAdminPanelMessage("No deletion has occurred"); // Show the confirmation message dialog
                    setTimeout(() => { // After 5 seconds hide the message again.
                        props.userStore.setAdminPanelMessageVisibility()
                    }, 5000);  
            }}>No
            </button>
        </Modal.Description>
        </Modal.Content>
    </Modal>
  );
}));

export default DeleteUserModal