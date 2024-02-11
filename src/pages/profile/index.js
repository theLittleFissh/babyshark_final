import React, { useEffect, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import VerificationAlert from "../../components/AuthComponent/VerificationAlert";
import { useAuth } from "../../context/AuthProvider";
import {
  collection,
  firebaseDB,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  arrayRemove,
  updateDoc,
} from "../../lib/firebaseConfig";
import styles from "../../styles/Profile.module.css";
import { Badge, Button, Card, Container } from "react-bootstrap";
import { convertTo12HourFormat } from "@/helper";
import UserInfoModal from "@/components/ProfileComponent/UserInfoModal";

export default function Profile() {
  const currentUser = useAuth().currentUser;
  const [postedServices, setPostedServices] = useState();
  const [interestedUser, setInterestedUser] = useState();
  const [showInterestedUserModal, setShowInterestedUserModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firebaseDB, "requested-services");

        // Using onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(servicesCollection, (querySnapshot) => {
          const servicesData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((service) => service.email === currentUser?.email);

          setPostedServices(servicesData);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [currentUser?.email]);

  const handleUserInfoModalClose = () => {
    setShowInterestedUserModal(false);
  };

  async function showProfile(interested) {
    try {
      const usersCollection = collection(firebaseDB, "users");
      const userQuery = query(
        usersCollection,
        where("email", "==", interested)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const interestedUserData = userQuerySnapshot.docs[0].data();
        setInterestedUser(interestedUserData);
        setShowInterestedUserModal(true);
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Handle the error appropriately in your application
    }
  }

  async function deleteService(serviceId) {
    try {
      // Display a confirmation dialog
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this service?"
      );

      if (!isConfirmed) {
        // User clicked cancel in the confirmation dialog
        return;
      }

      const serviceDocRef = doc(firebaseDB, "requested-services", serviceId);

      // Get the user email who posted the service
      const userEmail = currentUser?.email;

      // Delete the service document
      await deleteDoc(serviceDocRef);
      console.log(`Service with ID ${serviceId} deleted successfully`);

      // Find the user document based on the email
      const usersCollection = collection(firebaseDB, "users");
      const userQuery = query(usersCollection, where("email", "==", userEmail));
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        // Update the 'postedServices' array in the user document
        const userDocRef = doc(
          firebaseDB,
          "users",
          userQuerySnapshot.docs[0].id
        );
        await updateDoc(userDocRef, {
          postedServices: arrayRemove(serviceId),
        });
        console.log(
          `Service removed from 'postedServices' array in the user document`
        );
      } else {
        console.error(`User with email ${userEmail} not found`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  return (
    <div className={styles.profile_wrapper}>
      <h1 className="d-flex fw-bold justify-content-center">
        {currentUser?.displayName}
      </h1>

      <Container fluid className="mb-4">
        <h2>Requested Service</h2>
        <hr />

        {postedServices
          ? postedServices.map((service) => (
              <Card key={service.id} className="w-100">
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <strong>Order:</strong> {service.order}
                  <br />
                  <strong>Start Time:</strong>{" "}
                  {convertTo12HourFormat(service.startTime)}
                  <br />
                  <strong>End Time:</strong>{" "}
                  {convertTo12HourFormat(service.endTime)}
                  <br />
                  <strong>Date:</strong> {service.date}
                  <br />
                  <br />
                  <div>
                    <strong>Interested: </strong>
                    <div className="d-flex flex-wrap">
                      {service?.interested?.map((interested) => (
                        <div
                          key={interested}
                          className="m-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => showProfile(interested)}
                        >
                          <Badge>{interested}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() => deleteService(service.id)}
                    >
                      Delete Service
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          : null}
      </Container>
      {showInterestedUserModal ? (
        <UserInfoModal
          showModal={showInterestedUserModal}
          handleModalClose={handleUserInfoModalClose}
          setShowModal={setShowInterestedUserModal}
          data={interestedUser}
        />
      ) : null}
    </div>
  );
}
