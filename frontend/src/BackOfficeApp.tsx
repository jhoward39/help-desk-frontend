import React, { useEffect, useState, useRef } from 'react';
import './BackOfficeApp.css';
import RequestsSummary from './RequestsSummary';
import { Ticket } from './interfaces';
import { Dropdown } from 'react-bootstrap';
import { format } from 'date-fns'

const BackOfficeApp: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const getTickets = () => {
    fetch('https://zelpdeskapi.azurewebsites.net/api/support-tickets/')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }

  
  useEffect(() => {
    const handleMouseMove = () => {
      if (!intervalIdRef.current) {
        getTickets();
        intervalIdRef.current = window.setInterval(getTickets, 4000); // Check for new tickets every 4 seconds
      }
    };

    const handleMouseLeave = () => { // Clear the interval when the mouse leaves
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleDeleteTicket = () => {
    if (selectedTicket && window.confirm("Are you sure you want to delete this ticket?"))  {
      fetch(`https://zelpdeskapi.azurewebsites.net/api/support-tickets/${selectedTicket.id}/`, {
        method: 'DELETE',
      })
        .then(() => {
          setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id));
          setSelectedTicket(null);
        })
        .catch(error => console.error('Error deleting ticket:', error));
    }
  };

  const handleChangeStatus = (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    if (selectedTicket) {
      fetch(`https://zelpdeskapi.azurewebsites.net/api/support-tickets/${selectedTicket.id}/`, {
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
        })
        .catch(error => console.error('Error updating ticket:', error));
    }
  };

  return (
    <>
      <header className="App-header">
        <h2>ZELP DESK ADMIN</h2>
      </header>
    
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
              <p className="ticket-detail"><strong>Created:</strong> {format(new Date(selectedTicket.created_at), 'MMM dd, yy hh:mm:ss a')}</p>
              <p className="ticket-detail"><strong>Last Updated:</strong> {format(new Date(selectedTicket.updated_at), 'MMM dd, yy hh:mm:ss a')}</p>
              <p className="ticket-detail ticket-detail-description"><strong>Description:</strong> {selectedTicket.description}</p>
              <p className="ticket-detail ticket-detail-description"><strong>Reply:</strong> {selectedTicket.reply}</p>
            </>
          ) : (
            <p className="ticket-detail"><strong>No Ticket Selected</strong> <br/>Click on a ticket below</p>
          )}
        </div>

        <RequestsSummary tickets={tickets} onTicketSelect={handleTicketSelect} />
      </div>
    </>
  );
};

export default BackOfficeApp;
