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
    <div className="profile-container" style={{ backgroundColor: '#111', color: '#fff' }}>
      <Sidebar />
      <Container className="my-5">
        <Card className="profile-card" style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff' }}>
          <Card.Body>
            <h2 className="profile-header" style={{ color: '#4CD964' }}>User Profile</h2>

            <div className="profile-img-container">
              <Image
                src={profileImage || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                roundedCircle
                width={120}
                height={120}
                className="profile-img"
                style={{ objectFit: 'cover', border: '3px solid #4CD964' }}
              />
              {editMode && (
                <Form.Group controlId="formFile" className="mt-2">
                  <Form.Label style={{ color: '#ccc' }}>Update Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #444' }}
                  />
                </Form.Group>
              )}
            </div>

            <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Email:</strong> {user?.email}</p>

            {editMode ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#ccc' }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #444' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#ccc' }}>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #444' }}
                  />
                  <Form.Text style={{ color: '#999' }}>
                    Max 200 characters
                  </Form.Text>
                </Form.Group>
              </>
            ) : (
              <>
                <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Full Name:</strong> {userData?.fullName || "Not set"}</p>
                <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Bio:</strong> {userData?.bio || "No bio yet"}</p>
              </>
            )}

            <p style={{ color: '#ccc' }}>
              <strong style={{ color: '#fff' }}>Member Since:</strong>{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </p>

            {error && <p style={{ color: '#ff3b30' }}>{error}</p>}

            {editMode ? (
              <>
                <Button 
                  variant="success" 
                  onClick={handleUpdate} 
                  disabled={updating}
                  style={{ backgroundColor: '#4CD964', borderColor: '#4CD964', color: '#000' }}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </Button>{" "}
                <Button 
                  variant="secondary" 
                  onClick={() => setEditMode(false)}
                  style={{ backgroundColor: '#444', borderColor: '#444', color: '#fff' }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-primary" 
                onClick={() => setEditMode(true)}
                style={{ borderColor: '#4CD964', color: '#4CD964' }}
              >
                Edit Profile
              </Button>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
                style={{ borderColor: '#ff3b30', color: '#ff3b30' }}
              >
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