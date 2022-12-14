import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'
import { useNavigate } from 'react-router-dom'

const BoardModerator = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    retrieveUser()
  }, [])

  const retrieveUser = () => {
    UserService.getUserRole()
      .then((response) => {
        setUsers(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className="container mt-5">
      <table className="table text-center table-dark table-striped">
        <thead>
          <tr style={{color: 'white'}}>
            <th scope="col">ID</th>
            <th scope="col">Username</th>
            <th scope="col">Role</th>
            <th scope="col">Role ID</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {users? users.map((user, i) => (
            <tr style={{color: 'white'}}>
            <td key={i}>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.name}</td>
            <td>{user.roleId}</td>
            <td onClick={() => navigate(`/mod/${user.id}`)}>
            <i className="ri-edit-2-line"></i>
            </td>
          </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  )
}

export default BoardModerator