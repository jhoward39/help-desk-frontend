/**
 * RequestsSummary.tsx
 * 
 * This file defines the RequestsSummary component, which is used to display a summary of support tickets in the ZELP DESK ADMIN application.
 * 
 * The component provides a tabbed interface to filter and view support tickets based on their status (NEW, IN_PROGRESS, RESOLVED). It displays
 * the tickets in a table format, showing the name, email, and last updated date of each ticket. The component also includes tooltips for the
 * name and email fields to show the full text when hovered over.
 * 
 * Props:
 * - tickets: An array of Ticket objects representing the support tickets.
 * - isLoading: A boolean indicating whether the tickets are being loaded.
 * - selectedTab: A string indicating the currently selected tab (NEW, IN_PROGRESS, RESOLVED).
 * - setSelectedTab: A function to set the selected tab.
 * - onTicketSelect: A function to handle the selection of a ticket.
 * 
 * Key Features:
 * 1. Displays the count of tickets for each status (NEW, IN_PROGRESS, RESOLVED) in the tab headers.
 * 2. Filters and displays tickets based on the selected tab.
 * 3. Shows tooltips for the name and email fields when hovered over, displaying the full text.
 * 4. Handles ticket selection to display detailed information.
 * 
 * Dependencies:
 * - React: For building the UI components.
 * - react-bootstrap: For UI components like OverlayTrigger and Tooltip.
 * - date-fns: For formatting dates.
 * 
 * Author: Joseph Howard
 */

import React from 'react';
import './RequestsSummary.css';
import { Ticket } from './interfaces';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format } from 'date-fns';

interface RequestsSummaryProps {
  tickets: Ticket[];
  isLoading: boolean;
  selectedTab: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  setSelectedTab: (tab: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => void;
  onTicketSelect: (ticket: Ticket) => void 
}

const RequestsSummary: React.FC<RequestsSummaryProps> = ({ tickets, isLoading, selectedTab, setSelectedTab, onTicketSelect }) => {

  const counts = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.status]++;
      return acc;
    },
    { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0 }
  );

  const filteredTickets = tickets.filter(ticket => ticket.status === selectedTab);

  return (
    <div className="requests-summary">
      <div className="requests-summary-tabs">
        <button onClick={() => setSelectedTab('NEW')} className={`requests-summary-tab ${selectedTab === 'NEW' ? 'active' : ''}`}>
          New ({counts.NEW})
        </button>
        <button onClick={() => setSelectedTab('IN_PROGRESS')} className={`requests-summary-tab ${selectedTab === 'IN_PROGRESS' ? 'active' : ''}`}>
          In Progress ({counts.IN_PROGRESS})
        </button>
        <button onClick={() => setSelectedTab('RESOLVED')} className={`requests-summary-tab ${selectedTab === 'RESOLVED' ? 'active' : ''}`}>
          Resolved ({counts.RESOLVED})
        </button>
      </div>
      <div className="ticket-table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <tr key={ticket.id} className="ticket-table-row" onClick={() => onTicketSelect(ticket)}>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-name-${ticket.id}`}>{ticket.name}</Tooltip>}
                    >
                      <span>{ticket.name.length > 25 ? <strong>{ticket.name.substring(0, 25) + '...'}</strong> : <strong>{ticket.name}</strong>}</span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-${ticket.id}`}>{ticket.email}</Tooltip>}
                    >
                      <span>{ticket.email.length > 25 ? ticket.email.substring(0, 25) + '...' : ticket.email}</span>
                    </OverlayTrigger>
                  </td>
                  <td>{format(new Date(ticket.updated_at), 'MMM dd, yyyy hh:mm:ss a')}</td>
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? <td colSpan={3}>Loading...</td> : <td colSpan={3}>No support tickets found.</td>}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsSummary;
