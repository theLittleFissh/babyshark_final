import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function UserInfoModal({
  showModal,
  handleModalClose,
  setShowModal,
  data,
}) {
  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Name:</strong> {data?.name}
        </p>
        <p>
          <strong>Email:</strong> {data?.email}
        </p>
        <p>
          <strong>Phone:</strong> {data?.phone}
        </p>
        <p>
          <strong>Address:</strong> {data?.address}
        </p>
        <p>
          <strong>Nid:</strong> {data?.nid}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
