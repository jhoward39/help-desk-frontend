/**
 * BackOfficeApp.tsx
 * 
 * This file defines the BackOfficeApp component, which is a core part of the ZELP DESK ADMIN application.
 * The component manages and displays a list of support tickets, allowing users to view, update, and 
 * delete tickets, as well as reply to them. It also includes functionality to change the status of 
 * tickets and ensures that the state is maintained and updated correctly.
 * 
 * Key Features:
 * 1. Fetches and displays a list of support tickets from a backend API.
 * 2. Allows users to select a ticket and view its details.
 * 3. Enables users to change the status of a ticket (NEW, IN_PROGRESS, RESOLVED).
 * 4. Allows users to delete tickets that are not in the RESOLVED state.
 * 5. Provides a modal for confirming actions such as deleting a ticket or changing its status.
 * 6. Supports replying to tickets, with the ability to save replies as drafts.
 * 7. Uses debouncing to handle reply submissions efficiently.
 * 
 * Dependencies:
 * - React: For building the UI components.
 * - react-bootstrap: For UI components like Dropdown and Modal.
 * - date-fns: For formatting dates.
 * 
 * Note:
 * This component uses several helper components and utilities:
 * - ConfirmModal: A modal component for confirming actions.
 * - RequestsSummary: A component for summarizing and displaying the list of tickets.
 * - Ticket: An interface defining the structure of a support ticket.
 * - statusDisplayMap: A utility for mapping ticket status codes to display strings.
 * 
 * Author: Joseph Howard
 */

import React, { useEffect, useState} from 'react';
import './BackOfficeApp.css';
import ConfirmModal from './ConfirmModal';
import RequestsSummary from './RequestsSummary';
import { Ticket } from './interfaces';
import { statusDisplayMap } from './statusMapping';
import { Dropdown } from 'react-bootstrap';
import { format} from 'date-fns';


const BackOfficeApp: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [handleConfirm, setHandleConfirm] = useState<() => void>(() => {});
  const [selectedTab, setSelectedTab] = useState<'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('NEW');
  
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
    setReply(ticket.reply || ''); // fill reply box with draft reply
  };

  const deleteTicket = () => {
    // There is no situation where the ui allows for a resolved ticket to be deleted, but 
    if (selectedTicket && selectedTicket.status !== 'RESOLVED') {
      setIsLoading(true);
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'DELETE',
      })
        .then(() => {
          setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id));
          setSelectedTicket(null);
          getTickets();
        })
        .catch(error => console.error('Error deleting ticket:', error))
        .finally(() => {
          setShowModal(false);
          setIsLoading(false);
        });
    }
    else (
      console.log("Cannot delete tickets in resolved state")
    )
  };

  const changeStatus = (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    // if user is moving ticket to resolved, assert that draft is true
    const body = status === 'RESOLVED' ? { status, is_reply_draft: false} : {status} 
    setIsLoading(true);

    if (selectedTicket) {
      setIsLoading(true);
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then((updatedTicket: Ticket) => {
          setTickets(tickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket));
          setSelectedTicket(updatedTicket);
          getTickets();
        })
        .catch(error => console.error('Error updating ticket:', error))
        .finally(() => {
          setShowModal(false);
          setIsLoading(false);
          setSelectedTab(status);
        });
    }
  };

  const submitReply = (isDraft: boolean) => {
    if (selectedTicket) {
      setIsLoading(true);
      fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${selectedTicket.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply, is_reply_draft: isDraft }),
      })
        .then(response => response.json())
        .then((updatedTicket) => {
          setTickets(tickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket));
          setSelectedTicket(updatedTicket);
          console.log("SEND THE USER THE EMAIL: ", reply)
          if (!isDraft) {
            getTickets();
          }
        })
        .catch(error => console.error('Error updating ticket:', error))
        .finally(() => {
          if (isDraft === false ) {changeStatus('RESOLVED')};
          setShowModal(false);
          setIsLoading(false);
        });
    }
  }

  const handleSubmitReply = () => {
    
    setHandleConfirm(() => {
      return () => {
        submitReply(false);
      };
      
    });
    setConfirmMessage("Replying will resolve the ticket and notify the ticket originator");
    setShowModal(true);
  };

  const handleDeleteTicket = () => {
    
    setConfirmMessage("This action is irreversable");
    setHandleConfirm(() => deleteTicket);
    setShowModal(true);
    console.log("show modal", showModal);
  }

  const handleChangeStatus = (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    setConfirmMessage("Are you sure you want to force the status change?");
    setHandleConfirm(() => {
      return () => {
        changeStatus(status)
      }
    });
    setShowModal(true);
  }

  return (
    <>
      <header className="App-header">
        <h2>ZELP DESK ADMIN</h2>
      </header>

      <ConfirmModal 
        show={showModal} 
        confirmMessage={confirmMessage}
        handleClose={() => setShowModal(false)} 
        handleConfirm={handleConfirm} 
      />
    
      <div className="App">
        
        <div className="ticket-details">
          {selectedTicket ? (
            <>
              <div className="ticket-detail-header">
              <h3>Ticket Details</h3>
              {/* Dropdown options will not appear once ticket is resolved to avoid a situation
                where a user recieves a reply that is not on company record or has an edited reply
                after the fact (backoffice user deletes or forces status change after sending reply). 
                To develop this further, perhaps if the user responds to the email it could reopen the ticket and the ticket 
                could alow for nested replies or stat a new ticket as a RE: with references to prev tickets*/}
              {selectedTicket.status !== "RESOLVED"  && (
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
              )}
          
              </div>
              <p className="ticket-detail"><strong>Name:</strong> {selectedTicket.name}</p>
              <p className="ticket-detail"><strong>Email:</strong> {selectedTicket.email}</p>
              <p className="ticket-detail"><strong>Created:</strong> {format(new Date(selectedTicket.created_at), 'MMM dd, yyyy hh:mm:ss a')}</p>
              <p className="ticket-detail"><strong>Last Updated:</strong> {format(new Date(selectedTicket.updated_at), 'MMM dd, yyyy hh:mm:ss a')}</p>
              <p className="ticket-detail"><strong>Status:</strong> {statusDisplayMap[selectedTicket.status]}</p>
              <p className="ticket-detail ticket-detail-description"><strong>Description:</strong> {selectedTicket.description}</p>
              {/* When ticket is new, backoffice user will hit reply, this triggers the ticket to be in progress. 
                  Once in progress, a ticket can be replied. Once reply is submitted, ticket moves to resolved.
               */}
              {(() => {
                switch (selectedTicket.status) {
                  case "RESOLVED":
                    return <p className="ticket-detail ticket-detail-description"><strong>Reply:</strong> {selectedTicket.reply }</p>;
                  case "IN_PROGRESS":
                    return (
                      <>
                        <textarea
                          className="ticket-reply-field"
                          placeholder="Reply"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          required
                        ></textarea>
                        <button className="submit-reply-button" onClick={handleSubmitReply}>Submit Reply</button>
                      </>
                    );
                  case "NEW":
                  default:
                    return <button className="submit-reply-button" onClick={() => changeStatus('IN_PROGRESS')}>Reply</button>;
                }
              })()}
                
            </>
          ) : (
            isLoading ? <strong>Loading...</strong> : <p className="ticket-detail"><strong>No Ticket Selected</strong> <br/>Click on a ticket below</p> 
          )}
        </div>

        <RequestsSummary tickets={tickets} onTicketSelect={handleTicketSelect} isLoading={isLoading} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      </div>
    </>
  );
};

export default BackOfficeApp;
