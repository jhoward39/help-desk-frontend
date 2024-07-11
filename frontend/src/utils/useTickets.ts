/**
 * useTickets
 * 
 * The `useTickets` hook provides functionality to manage and fetch support tickets from a backend API.
 * It encapsulates the state and logic required to handle fetching tickets and managing their state 
 * within a React component.
 * 
 * @returns {{
*   tickets: Ticket[];
*   isLoading: boolean;
*   getTickets: () => void;
*   setTickets: (tickets: Ticket[]) => void;
* }}
* 
*/

import { useState, useCallback } from 'react';
import { Ticket } from '@customTypes/interfaces';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTickets = useCallback(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/support-tickets/`)
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { tickets, isLoading, getTickets, setTickets };
};
