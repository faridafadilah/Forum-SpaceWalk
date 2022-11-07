import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserService from '../../services/user.service'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ThreadService from '../../services/thread-forum'
import FormErrors from '../../components/FormError/FormError'
import { Tiptap } from '../../components/UI Public/TipTap/TipTap'
import '../../assets/css/Form.css'

const CreateThread = () => {
  const [loading, setLoading] = useState(false)
  const { subforumId } = useParams()
  const { user: currentUser } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState('')
  const [errors, setErrors] = useState([])
  const [file, setFile] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState('')
  const navigate = useNavigate()

  const getUser = (userId) => {
    UserService.getUserAllById(userId)
      .then((response) => {
        setUsers(response.data)
      })
      .catch((e) => {
        setErrors([e.response.data.message])
      })
  }

  useEffect(() => {
    getUser(currentUser.id)
  }, [])

  const loadImage = (e) => {
    const image = e.target.files[0]
    setFile(image)
    setPreview(URL.createObjectURL(image))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    let errors = 0

    if (!title) {
      setErrors(['Title is Require!'])
      errors++
    }
    if (!content) {
      setErrors(['Content is Require!'])
      errors++
    }
    if (errors) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('userId', currentUser.id)
    formData.append('userName', currentUser.username)
    formData.append('userImage', users.url)
    formData.append('subforumId', subforumId)
    ThreadService.createThread(formData)
     .then((response) => {
        const { id } = response.data
        navigate('/thread/' + id)
     })
     .catch((e) => {
        setErrors([e.response.data.message])
        setLoading(false)
     })
  }

  return (
    <div className="create-main">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: '8px' }}>
        {!!errors.length && <FormErrors errors={errors} />}
        <h2 className="typograpy">Title Thread</h2>
        <TextField
          required
          fullWidth
          label="Title"
          className="text-input"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h2 className="typograpy">Image Thread</h2>
        <TextField required className="text-input" fullWidth name="image" type="file" onChange={loadImage} />
        {preview ? (
          <figure className="image is-128x128">
            <img src={preview} alt="Preview" />
          </figure>
        ) : (
          ''
        )}
        <Button
          type="submit"
          variant="contained"
          className="post"
          sx={{
            marginLeft: '76%',
            position: 'absolute',
            bottom: '0',
            marginBottom: '9px',
            left: 0,
            background: '#816aff',
          }}
        >
          {loading && <span className="spinner-border spinner-border-sm"></span>}
          Post
        </Button>
      </Box>
      <h2 className="typograpy">Content</h2>
      <Tiptap setValue={setContent} />
    </div>
  )
}

export default CreateThread
