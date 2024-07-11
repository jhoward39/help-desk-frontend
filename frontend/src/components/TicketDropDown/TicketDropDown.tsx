import React from 'react';
import { Dropdown } from 'react-bootstrap';
import '@components/TicketDropDown/TicketDropDown.css'

interface TicketDropDownProps {
  handleChangeStatus: (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
  handleDeleteTicket: () => void;
}

const TicketDropDown: React.FC<TicketDropDownProps> = ({handleChangeStatus, handleDeleteTicket}) => {


  return (
    <>
     <Dropdown className="ticket-dropdown">
        <Dropdown.Toggle id="ticket-dropdown-toggle">
          <i className="bi bi-three-dots-vertical"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item className="change-status-button" onClick={() => handleChangeStatus('NEW')}>Mark New</Dropdown.Item>
          <Dropdown.Item className="change-status-button" onClick={() => handleChangeStatus('IN_PROGRESS')}>Mark In Progress</Dropdown.Item>
          <Dropdown.Item className="change-status-button" onClick={() => handleChangeStatus('RESOLVED')}>Mark Resolved</Dropdown.Item>
          <Dropdown.Item className="delete-ticket-button" onClick={handleDeleteTicket}>Delete Ticket</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>   
    </>
  );
};

export default TicketDropDown;
