import React, { useEffect, useState } from 'react';
import './BackOfficeApp.css';
import RequestsSummary from './RequestsSummary';
import { Ticket } from './interfaces';
import 'bootstrap/dist/css/bootstrap.min.css';

const BackOfficeApp: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/support-tickets/')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>ZELP DESK ADMIN</h2>
      </header>
      {selectedTicket && (
        <div className="ticket-details">
          <h3>Ticket Details</h3>
          <p><strong>Name:</strong> {selectedTicket.name}</p>
          <p><strong>Email:</strong> {selectedTicket.email}</p>
          <p><strong>Description:</strong> {selectedTicket.description}</p>
        </div>
      )}
      <RequestsSummary tickets={tickets} onTicketSelect={handleTicketSelect} />
    </div>
  );
};

export default BackOfficeApp;
