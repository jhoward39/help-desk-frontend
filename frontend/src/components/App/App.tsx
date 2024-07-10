import React, { useState, FormEvent } from 'react';
import '@components/App/App.css';
import { Ticket } from '@customTypes/interfaces';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [userMessage, setUserMessage] = useState<{'kind': ('user-message-error' | 'user-message-success'), 'message': string} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newTicket = { name, email, description };

    fetch('https://backend-holy-flower-6086.fly.dev/api/support-tickets/', {
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
        setUserMessage({"kind": "user-message-success", "message": "You successfully submitted a ticket. \n We will get back to you within 3 business days."})
      })
      .catch(()=> {
        setUserMessage({"kind": "user-message-error", "message": "Problem submitting ticket. Please try again later."})
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <header className="App-header">
        <h2>ZELP DESK</h2>
      </header>
  
      <div className="App">
        <form className="submit-new-request" onSubmit={handleSubmit}>
          <div className="submit-new-ticket-label">
            <h5 className="submit-new-ticket-label-text">Make a new ticket</h5>
          </div>
          <input
            className="submit-request-form-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setUserMessage(null);
            }}
            required
          />
          <input
            className="submit-request-form-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setUserMessage(null);
            }}
            required
          />
          <textarea
            className="submit-request-description-field"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setUserMessage(null);
            }}
            required
          ></textarea>
          {!isLoading ? (
            <button type="submit" className="submit-ticket-button" disabled={isLoading}>Submit Ticket</button>
          ): (
            <div className="spinner-border m-2" role="status"/>
          )}
          
        </form>
        {userMessage && 
          <div 
              className={`user-message ${userMessage.kind}`}
          >
            {userMessage.message}
          </div>}
      </div>
    </>
  );
}

export default App;
