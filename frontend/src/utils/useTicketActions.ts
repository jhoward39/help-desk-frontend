/**
 * useTicketActions
 * 
 * The `useTicketActions` hook provides functionality to manage support ticket actions 
 * such as deleting a ticket, changing its status, and submitting replies. 
 * 
 * @param {Ticket[]} tickets - The current list of tickets.
 * @param {(tickets: Ticket[]) => void} setTickets - A function to update the list of tickets.
 * 
 * @returns {{
*   selectedTicket: Ticket | null;
*   setSelectedTicket: (ticket: Ticket | null) => void;
*   reply: string;
*   setReply: (reply: string) => void;
*   deleteTicket: (ticket: Ticket) => Promise<void>;
*   changeStatus: (ticket: Ticket, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => Promise<void>;
*   submitReply: (ticket: Ticket, reply: string, isDraft: boolean) => Promise<void>;
*   handleTicketPost: (name: string, email: string, description: string) => Promise<void>;
* }}
*/

import { useState } from 'react';
import { Ticket } from '@customTypes/interfaces';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useTicketActions = (tickets: Ticket[], setTickets: (tickets: Ticket[]) => void) => {
 const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
 const [reply, setReply] = useState<string>('');

 // Deletes the specified ticket from the backend and updates the local state.
 const deleteTicket = async (ticket: Ticket) => {
   await fetch(`${API_BASE_URL}/support-tickets/${ticket.id}/`, {
     method: 'DELETE',
   });
   setTickets(tickets.filter(t => t.id !== ticket.id));
   setSelectedTicket(null);
 };

 // Changes the status of the specified ticket with no side effects.
 const changeStatus = async (ticket: Ticket, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
   const body = status === 'RESOLVED' ? { status, is_reply_draft: false } : { status };
   const response = await fetch(`${API_BASE_URL}/support-tickets/${ticket.id}/`, {
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

 // Submits a reply to the specified ticket, with an option to save it as a draft.
 const submitReply = async (ticket: Ticket, reply: string, isDraft: boolean) => {
   const response = await fetch(`${API_BASE_URL}/support-tickets/${ticket.id}/`, {
     method: 'PATCH',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ reply, is_reply_draft: isDraft, status: 'RESOLVED'}),
   });
   const updatedTicket = await response.json();
   setTickets(tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t)));
   setSelectedTicket(updatedTicket);
 };

 // Handles the posting of a new ticket.
 const handleTicketPost = async (name: string, email: string, description: string) => {
   const newTicket = { name, email, description };
   const response = await fetch(`${API_BASE_URL}/support-tickets/`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(newTicket),
   });
   const data: Ticket = await response.json();
   setTickets([...tickets, data]);
 };

 return { selectedTicket, setSelectedTicket, reply, setReply, deleteTicket, changeStatus, submitReply, handleTicketPost };
};
