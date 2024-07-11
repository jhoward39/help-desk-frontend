/**
 * TicketDisplay
 * 
 * The `TicketDisplay` component is responsible for displaying the details of a selected support ticket.
 * It allows users to view ticket details, change the status of the ticket, delete the ticket, and 
 * submit replies to the ticket. The component conditionally renders different elements based on 
 * the status of the ticket.
 * 
 * @param {{
*   selectedTicket: Ticket | null;
*   reply: string;
*   handleChangeStatus: (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
*   changeStatus: (ticket: Ticket, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
*   handleDeleteTicket: () => void;
*   handleSubmitReply: () => void;
*   setReply: (reply: string) => void;
* }} props - The props for the component.
* 
* @returns {JSX.Element} The rendered `TicketDisplay` component.
*/

import React from 'react';
import '@components/TicketDisplay/TicketDisplay.css'
import TicketDropDown from '@components/TicketDropDown/TicketDropDown'
import { Ticket } from '@customTypes/interfaces';
import { statusDisplayMap } from '@customUtils/statusMapping';
import { format} from 'date-fns';

interface TicketDisplayProps {
  selectedTicket: Ticket | null;
  reply: string;
  handleChangeStatus: (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
  changeStatus: (ticket: Ticket, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
  handleDeleteTicket: () => void;
  handleSubmitReply: () => void;
  setReply: (reply: string) => void;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({selectedTicket, reply, handleChangeStatus, changeStatus, handleDeleteTicket, handleSubmitReply, setReply}) => {


  return (
    <>
    {selectedTicket && (
    <>
      <div className="ticket-detail-header">
      <h3>Ticket Details</h3>
      {/* Dropdown options will not appear once ticket is resolved to avoid a situation
        where a user recieves a reply that is not on company record or has an edited reply
        after the fact (backoffice user deletes or forces status change after sending reply). 
        To develop this further, perhaps if the user responds to the email it could reopen the ticket and the ticket 
        could alow for nested replies or stat a new ticket as a RE: with references to prev tickets*/}
      {selectedTicket.status !== "RESOLVED"  && (
        <TicketDropDown handleChangeStatus={handleChangeStatus} handleDeleteTicket={handleDeleteTicket}/>
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
            return <button className="submit-reply-button" onClick={() => changeStatus(selectedTicket,'IN_PROGRESS')}>Reply</button>;
        }
      })()} 
    </>
    )}
    </>
  );
};

export default TicketDisplay;


