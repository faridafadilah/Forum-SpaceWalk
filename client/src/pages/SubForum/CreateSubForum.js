import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SubService from "../../services/sub-forum";
import FormErrors from "../../components/FormError/FormError";
import "../../assets/css/Form.css";

const CreateSubForum = () => {
  const [loading, setLoading] = useState(false);
  const { mainforumId } = useParams();
  const [errors, setErrors] = useState([]);
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    let errors = 0;

    if (!judul) {
      setErrors(["Title is Require!"]);
      errors++;
    }
    if (!description) {
      setErrors(["Description is Require!"]);
      errors++;
    }
    if (!file) {
      setErrors(["Image Require!"]);
      errors++;
    }
    if (errors) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("judul", judul);
    formData.append("mainforumId", mainforumId);
    formData.append("description", description);
    SubService.createSubForum(formData)
      .then((response) => {
        const { id } = response.data;
        navigate("/sub/" + id);
      })
      .catch((e) => {
        setErrors([e.response.data.message]);
        setLoading(false);
      });
  };

  return (
    <div className="create-main">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {!!errors.length && <FormErrors errors={errors} />}
        <h2 className="typograpy">Judul</h2>
        <TextField
          required
          fullWidth
          className="text-input"
          name="judul"
          value={judul || ""}
          onChange={(e) => setJudul(e.target.value)}
        />
        <h2 className="typograpy">Description</h2>
        <textarea
          className="text-area"
          required
          name="description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className="typograpy">Image</h2>
        <TextField
          required
          className="text-input"
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
          sx={{ mt: 3, mb: 2, background: "#816aff" }}
        >
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          Save
        </Button>
      </Box>
    </div>
  );
};

export default CreateSubForum;
