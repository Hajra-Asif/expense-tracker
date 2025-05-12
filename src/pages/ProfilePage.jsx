import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Image } from "react-bootstrap";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ 
    fullName: "", 
    bio: "" 
  });
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setFormData({
              fullName: data.fullName || "",
              bio: data.bio || "",
            });
            setProfileImage(data.profileImage || DEFAULT_PROFILE_IMAGE);
          } else {
            // Initialize new user with default values
            setUserData({
              fullName: "",
              bio: "",
              profileImage: DEFAULT_PROFILE_IMAGE
            });
            setProfileImage(DEFAULT_PROFILE_IMAGE);
          }
        } catch (err) {
          setError("Error fetching user data");
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/login"));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        bio: formData.bio,
        profileImage: profileImage || DEFAULT_PROFILE_IMAGE,
      });
      setUserData((prev) => ({
        ...prev,
        fullName: formData.fullName,
        bio: formData.bio,
        profileImage: profileImage || DEFAULT_PROFILE_IMAGE,
      }));
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
  <Sidebar />
  <Container className="my-5">
    <Card className="profile-card">
      <Card.Body>
        <h2 className="profile-header">User Profile</h2>

        <div className="profile-img-container">
          <Image
            src={profileImage || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
            roundedCircle
            width={120}
            height={120}
            className="profile-img"
            style={{ objectFit: 'cover' }}
          />
          {editMode && (
            <Form.Group controlId="formFile" className="mt-2">
              <Form.Label>Update Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          )}
        </div>

        <p><strong>Email:</strong> {user?.email}</p>

        {editMode ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <Form.Text className="text-muted">
                Max 200 characters
              </Form.Text>
            </Form.Group>
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {userData?.fullName || "Not set"}</p>
            <p><strong>Bio:</strong> {userData?.bio || "No bio yet"}</p>
          </>
        )}

        <p>
          <strong>Member Since:</strong>{" "}
          {user?.metadata?.creationTime
            ? new Date(user.metadata.creationTime).toLocaleDateString()
            : "N/A"}
        </p>

        {error && <p className="text-danger">{error}</p>}

        {editMode ? (
          <>
            <Button variant="success" onClick={handleUpdate} disabled={updating}>
              {updating ? "Updating..." : "Save Changes"}
            </Button>{" "}
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="outline-primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card.Body>
    </Card>
  </Container>
</div>

  );
};

export default ProfilePage;