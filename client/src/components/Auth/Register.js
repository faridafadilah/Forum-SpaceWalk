import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import * as Yup from 'yup'
import spaceVideo from '../../assets/img/space.mp4'
import { register } from '../../slices/auth'
import { clearMessage } from '../../slices/message'
import './LoginRegister.css'

const Register = () => {
  let navigate = useNavigate()
  const [successful, setSuccessful] = useState(false)
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { message } = useSelector((state) => state.message)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearMessage())
  }, [dispatch])

  const initialValues = {
    username: '',
    email: '',
    password: '',
  }

  // Validasi Inputan
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        'len',
        'The username must be between 3 and 20 characters.',
        (val) => val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required('This field is required!'),
    email: Yup.string().email('This is not a valid email.').required('This field is required!'),
    password: Yup.string()
      .test(
        'len',
        'The password must be between 6 and 40 characters.',
        (val) => val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required('This field is required!'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  })

  // function Handle submit
  const hadleRegister = (formValue) => {
    const { username, email, password } = formValue
    setSuccessful(false)
    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true)
        navigate('/login')
      })
      .catch((e) => {
        setSuccessful(false)
      })
  }

   // Jika Sudah Login
   if (isLoggedIn) {
    return <Navigate to="/profile" />
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
        >
          <video autoPlay loop muted id="video">
          <source src={spaceVideo} type="video/mp4" />
        </video>
        </Grid>
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square sx={{
          background: 'var(--body-bg)',
          boxShadow: '0px 0px 0px 0px rgb(0 0 0 / 0%)',
        }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {message && (
            <div className="form-group">
              <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role="alert">
                {message}
              </div>
            </div>
          )}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={hadleRegister}>
            <Form className="formFields">
              <div className="formField">
                <label className="formFieldLabel" htmlFor="username">
                  Username
                </label>
                <Field name="username" type="text" className="formFieldInput" placeholder="Enter your username" />
                <ErrorMessage sx={{ m: 2 }} name="username" component="div" className="alert alert-danger" />
              </div>

              <div className="formField">
                <label className="formFieldLabel" htmlFor="email">
                  Email
                </label>
                <Field name="email" type="email" className="formFieldInput" placeholder="Enter your email" />
                <ErrorMessage sx={{ m: 2 }} name="email" component="div" className="alert alert-danger" />
              </div>

              <div className="formField">
                <label className="formFieldLabel" htmlFor="password">
                  Password
                </label>
                <Field name="password" type="password" className="formFieldInput" placeholder="Enter your password" />
                <ErrorMessage sx={{ m: 2 }} name="password" component="div" className="alert alert-danger"/>
              </div>

              <div className="formField">
                <label className="formFieldLabel" htmlFor="password">
                  Confirm Password
                </label>
                <Field name="confirmPassword" type="password" className="formFieldInput" placeholder="Enter Again your password" />
                <ErrorMessage sx={{ m: 2 }} name="confirmPassword" component="div" className="alert alert-danger"/>
              </div>

              <div className="formField">
                <button className="formFieldButton">Register</button>
              </div>
            </Form>
          </Formik>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Register
