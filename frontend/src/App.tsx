import React, { useEffect, useState, FormEvent } from 'react';
import './App.css';
import RequestsSummary from './RequestsSummary'
import { Ticket } from './interfaces';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8000/api/support-tickets/')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newTicket = { name, email, description };

    fetch('http://localhost:8000/api/support-tickets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTicket),
    })
      .then(response => response.json())
      .then((data: Ticket) => {
        setTickets([...tickets, data]);
        setName('');
        setEmail('');
        setDescription('');
      })
      .catch(error => console.error('Error posting ticket:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>ZELP DESK</h2>
      </header>
      <form className="submit-new-request" onSubmit={handleSubmit}>
        <input
          className="submit-request-form-field"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="submit-request-form-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className="submit-request-description-field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="submit-ticket-button">Submit Ticket</button>
      </form>
      <RequestsSummary tickets={tickets} onTicketSelect={() => {}}/>
    </div>
  );
}

export default App;
