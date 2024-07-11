import { useState } from 'react';
import { Ticket } from '@customTypes/interfaces';

export const useTicketActions = (tickets: Ticket[], setTickets: (tickets: Ticket[]) => void) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState<string>('');

  const deleteTicket = async (ticket: Ticket) => {
    await fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${ticket.id}/`, {
      method: 'DELETE',
    });
    setTickets(tickets.filter(t => t.id !== ticket.id));
    setSelectedTicket(null);
  };

  const changeStatus = async (ticket: Ticket, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    const body = status === 'RESOLVED' ? { status, is_reply_draft: false } : { status };
    const response = await fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${ticket.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const updatedTicket = await response.json();
    setTickets(tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
  };

  const submitReply = async (ticket: Ticket, reply: string, isDraft: boolean) => {
    const response = await fetch(`https://backend-holy-flower-6086.fly.dev/api/support-tickets/${ticket.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reply, is_reply_draft: isDraft }),
    });
    const updatedTicket = await response.json();
    setTickets(tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
  };

  return { selectedTicket, setSelectedTicket, reply, setReply, deleteTicket, changeStatus, submitReply };
};
