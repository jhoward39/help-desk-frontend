import { useState, useEffect } from 'react';
import { Ticket } from '@customTypes/interfaces';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTickets = () => {
    setIsLoading(true);
    fetch('https://backend-holy-flower-6086.fly.dev/api/support-tickets/')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error))
      .finally(() => {
        setIsLoading(false);
        console.log("isloading false")
      });
  };

  useEffect(() => {
    getTickets();
  }, []);

  return { tickets, isLoading, getTickets, setTickets };
};
