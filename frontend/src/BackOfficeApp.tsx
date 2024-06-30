import React, { useEffect, useState, useRef } from 'react'
import './BackOfficeApp.css'
import RequestsSummary from './RequestsSummary'
import { Ticket } from './interfaces'
import { Dropdown } from 'react-bootstrap'
import { format } from 'date-fns'
import ConfirmModal from './ConfirmModal'

const BackOfficeApp: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const getTickets = () => {
    setIsLoading(true);

    fetch('https://backend-holy-flower-6086.fly.dev/api/support-tickets/')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error))
      .finally(() => setIsLoading(false));
  }
  
  useEffect(() => {
    getTickets();
  }, []);
  
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleDeleteTicket = () => {
    if (selectedTicket && window.confirm("Are you sure you want to delete this ticket?"))  {
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'DELETE',
      })
        .then(() => {
          setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id));
          setSelectedTicket(null);
          getTickets();
        })
        .catch(error => console.error('Error deleting ticket:', error));
    }
  };

  const handleChangeStatus = (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    if (selectedTicket) {
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
        .then(response => response.json())
        .then((updatedTicket: Ticket) => {
          setTickets(tickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket));
          setSelectedTicket(updatedTicket);
          getTickets();
        })
        .catch(error => console.error('Error updating ticket:', error));
    }
  };

  const handleConfirm = () => {
    if (selectedTicket) {
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
        .then(response => response.json())
        .then((updatedTicket: Ticket) => {
          setTickets(tickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket));
          setSelectedTicket(updatedTicket);
          getTickets();
        })
        .catch(error => console.error('Error updating ticket:', error));
    }
  }

  return (
    <>
      <header className="App-header">
        <h2>ZELP DESK ADMIN</h2>
      </header>

      <ConfirmModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleConfirm={handleConfirm} 
      />
    
      <div className="App">
        
        <div className="ticket-details">
          {selectedTicket ? (
            <>
              <div className="ticket-detail-header">
              <h3>Ticket Details</h3>
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
              </div>
              <p className="ticket-detail"><strong>Name:</strong> {selectedTicket.name}</p>
              <p className="ticket-detail"><strong>Email:</strong> {selectedTicket.email}</p>
              <p className="ticket-detail"><strong>Created:</strong> {format(new Date(selectedTicket.created_at), 'MMM dd, yyyy hh:mm:ss a')}</p>
              <p className="ticket-detail"><strong>Last Updated:</strong> {format(new Date(selectedTicket.updated_at), 'MMM dd, yyyy hh:mm:ss a')}</p>
              <p className="ticket-detail ticket-detail-description"><strong>Description:</strong> {selectedTicket.description}</p>
              { selectedTicket.reply ? (
                <p className="ticket-detail ticket-detail-description"><strong>Reply:</strong> {selectedTicket.reply }</p>
              ): (
                <>
                  <textarea
                    className="ticket-reply-field"
                    placeholder="Reply"
                    value={reply}
                    onChange={(e) => {
                      setReply(e.target.value);
                      
                    }}
                    required
                  ></textarea>
                  <button className="submit-reply-button" onClick={() => setShowModal(true)}>Submit Reply</button>
                </>
              )}
              
            </>
          ) : (
            isLoading ? <strong>Loading...</strong> : <p className="ticket-detail"><strong>No Ticket Selected</strong> <br/>Click on a ticket below</p> 
          )}
        </div>

        <RequestsSummary tickets={tickets} onTicketSelect={handleTicketSelect} isLoading={isLoading} />
      </div>
    </>
  );
};

export default BackOfficeApp;
