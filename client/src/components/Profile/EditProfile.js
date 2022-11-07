import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormErrors from "../FormError/FormError";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import userService from "../../services/user.service";
import "../../assets/css/Form.css";
import moment from "moment";

const EditProfile = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [address, setAddress] = useState("");
  const [hobies, setHobies] = useState("");
  const [github, setGithub] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    getProfileId();
  }, []);

  const getProfileId = async () => {
    userService
      .getProfile(currentUser.id)
      .then((response) => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setBio(response.data.bio);
        setGender(response.data.gender);
        setBirth(response.data.birth);
        setAddress(response.data.address);
        setHobies(response.data.hobies);
        setGithub(response.data.github);
        setLinkedin(response.data.linkedin);
        setWhatsapp(response.data.whatsapp);
        setFile(response.data.image);
        setPreview(response.data.url);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setErrors([]);
    let errors = 0;

    if (!gender) {
      setErrors(["Please Gender Require!"]);
      errors++;
    }
    if (!birth) {
      setErrors(["Please Birth of Date Require!"]);
      errors++;
    }
    if (errors) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("gender", gender);
    formData.append("birth", birth);
    formData.append("address", address);
    formData.append("hobies", hobies);
    formData.append("github", github);
    formData.append("whatsapp", whatsapp);
    formData.append("linkedin", linkedin);
    userService
      .editProfile(currentUser.id, formData)
      .then((response) => {
          navigate('/profile')
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-main">
      <Box component="form" onSubmit={updateProfile} noValidate sx={{ mt: 1 }}>
        {!!errors.length && <FormErrors errors={errors} />}
        <h2 className="typograpy">Username: </h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="username"
          value={username || ""}
          readOnly
        />
        <h2 className="typograpy">Email</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h2 className="typograpy">Bio</h2>
        <textarea
          required
          name="bio"
          className="text-area"
          value={bio === "null" ? "" : bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <h2 className="typograpy">Gender</h2>
        <Select
          name="gender"
          fullWidth
          id="demo-simple-select"
          className="text-input"
          value={gender === "null" ? "" : gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value={"Female"}>Female</MenuItem>
          <MenuItem value={"Male"}>Male</MenuItem>
        </Select>
        <h2 className="typograpy">Date of Birth</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="birth"
          type="date"
          value={moment(birth).locale("en").format("YYYY-MM-DD")}
          onChange={(e) => setBirth(e.target.value)}
        />
        <h2 className="typograpy">Address</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="address"
          value={address === "null" ? "" : address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <h2 className="typograpy">Hobi</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="hobies"
          value={hobies === "null" ? "" : hobies}
          onChange={(e) => setHobies(e.target.value)}
        />
        <h2 className="typograpy">Username Github</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="github"
          value={github === "null" ? "" : github}
          onChange={(e) => setGithub(e.target.value)}
        />
        <h2 className="typograpy">No WhatsApp (example: +628283721819)</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="whatsapp"
          value={whatsapp === "null" ? "" : whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <h2 className="typograpy">Link Linkedin</h2>
        <TextField
          required
          className="text-input"
          fullWidth
          name="linkedin"
          value={linkedin === "null" ? "" : linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />
        <h2 className="typograpy">Image Profile</h2>
        <TextField
          className="text-input"
          required
          fullWidth
          name="image"
          type="file"
          onChange={loadImage}
        />
        {preview ? (
          <figure className="image is-128x128">
            <img src={preview} alt="Preview" />
          </figure>
        ) : (
          ""
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update Profile
        </Button>
      </Box>
    </div>
  );
};

export default EditProfile;
