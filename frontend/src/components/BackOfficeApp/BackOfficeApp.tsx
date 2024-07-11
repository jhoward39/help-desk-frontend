
import React, { useEffect, useState } from 'react';
import '@components/BackOfficeApp/BackOfficeApp.css';
import ConfirmModal from '@components/ConfirmModal/ConfirmModal';
import TicketDisplay from '@components/TicketDisplay/TicketDisplay';
import RequestsSummary from '@components/RequestsSummary/RequestsSummary';
import { statusDisplayMap } from '@customUtils/statusMapping';
import { Ticket } from '@customTypes/interfaces'
import { useTickets } from '@customUtils/useTickets';
import { useTicketActions } from '@customUtils/useTicketActions';

const BackOfficeApp: React.FC = () => {
  const { tickets, isLoading, getTickets, setTickets } = useTickets();
  const { selectedTicket, setSelectedTicket, reply, setReply, deleteTicket, changeStatus, submitReply } = useTicketActions(tickets, setTickets);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [handleConfirm, setHandleConfirm] = useState<() => void>(() => {});
  const [selectedTab, setSelectedTab] = useState<'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('NEW');

  useEffect(() => {
    getTickets();
  }, [getTickets]);

  const handleTicketSelect = (ticket: Ticket) => {
    if (selectedTicket?.is_reply_draft && reply !== '') {
      submitReply(selectedTicket, reply, true);
    }
    setSelectedTicket(ticket);
    setReply(ticket.reply || '');
  };

  const handleSubmitReply = () => {
    setHandleConfirm(() => () => submitReply(selectedTicket!, reply, false));
    setConfirmMessage("Replying will resolve the ticket and notify the ticket originator.");
    setShowModal(true);
  };

  const handleDeleteTicket = () => {
    setConfirmMessage("Caution, this action is irreversible.");
    setHandleConfirm(() => () => deleteTicket(selectedTicket!));
    setShowModal(true);
  };

  const handleChangeStatus = (status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    setConfirmMessage(`Are you sure you want to force this ticket's status to '${statusDisplayMap[status]}'?`);
    setHandleConfirm(() => () => changeStatus(selectedTicket!, status));
    setShowModal(true);
  };

  return (
    <>
      <header className="App-header">
        <h2>ZELP DESK ADMIN</h2>
      </header>

      <ConfirmModal
        show={showModal}
        confirmMessage={confirmMessage}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
      />

      <div className="App">
        <div className="ticket-details">
          {selectedTicket ? (
            <TicketDisplay
              selectedTicket={selectedTicket}
              reply={reply}
              changeStatus={changeStatus}
              handleChangeStatus={handleChangeStatus}
              handleDeleteTicket={handleDeleteTicket}
              handleSubmitReply={handleSubmitReply}
              setReply={setReply}
            />
          ) : (
            isLoading ? <strong>Loading...</strong> : <p className="ticket-detail"><strong>No Ticket Selected</strong> <br />Click on a ticket below</p>
          )}
        </div>

        <RequestsSummary
          tickets={tickets}
          onTicketSelect={handleTicketSelect}
          isLoading={isLoading}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </>
  );
};

export default BackOfficeApp;
