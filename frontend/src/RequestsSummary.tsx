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
