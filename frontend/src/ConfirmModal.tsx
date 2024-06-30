// ConfirmModal.tsx
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './ConfirmModal.css'

interface ConfirmModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to submit your reply?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;

