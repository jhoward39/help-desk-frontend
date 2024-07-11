// src/ConfirmModal.tsx
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import '@components/ConfirmModal/ConfirmModal.css'

interface ConfirmModalProps {
  show: boolean;
  confirmMessage: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, confirmMessage, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} className="confirm-modal">
      <Modal.Header closeButton >
        <Modal.Title>Confirm Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmMessage}</Modal.Body>
      <Modal.Footer>
        <Button className="modal-cancel" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="modal-confirm" onClick={handleConfirm} onMouseUp={handleClose}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
