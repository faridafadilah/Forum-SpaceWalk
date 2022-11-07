import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Button, Typography } from '@mui/material'
import '../../assets/css/Form.css'

const EditUser = () => {
  const initialUserState = {
    id: null,
    roleId: null,
  }
  const [currentUser, setCurrentUser] = useState(initialUserState)
  const [message, setMessage] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  const getUser = (userId) => {
    UserService.getUserId(userId)
      .then((response) => {
        setCurrentUser(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    getUser(id)
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCurrentUser({ ...currentUser, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')
    if (currentUser.roleId) {
      UserService.updateRoleId(id, currentUser)
        .then((response) => {
          console.log(response.data)
          navigate('/mod')
          setMessage('The User was updated successfully!')
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }

  return (
    <div className="create-main">
      <Box sx={{ minWidth: 120 }}>
        <form onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Role
          </Typography>
          <FormControl fullWidth>
            <Select
              className="text-input"
              name="roleId"
              id="demo-simple-select"
              value={currentUser.roleId || ''}
              onChange={handleInputChange}
            >
              <MenuItem value={3}>Admin</MenuItem>
              <MenuItem value={1}>User</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" sx={{ marginTop: '3%' }} variant="contained">
            Update
          </Button>
        </form>
      </Box>
    </div>
  )
}

export default EditUser
