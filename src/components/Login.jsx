import React, { useState } from 'react'
import Axios from '../axiosInstance/AxiosIndex'
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
function Login () {
  const toast = useToast();
const navigate=useNavigate()
  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  function handleChange (e) {
    const { name, value } = e.target

    setTouched({ ...touched, [name]: true })

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!value.trim()) {
        setErrors({
          ...errors,
          [name]: 'This field is required'
        })
      } else if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Enter a valid email address'
        })
      } else {
        setErrors({ ...errors, [name]: '' })
        setData({ ...data, [name]: value })
      }
    } else if (name === 'password') {
      if (!value.trim()) {
        setErrors({
          ...errors,
          [name]: 'This field is required'
        })
      } else if (value.length < 6) {
        setErrors({
          ...errors,
          [name]: 'Password must be at least 6 characters long'
        })
      } else {
        setErrors({ ...errors, [name]: '' })
        setData({ ...data, [name]: value })
      }
    }
    setData({ ...data, [name]: value })
  }

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(data, 'data');
    
    try {
      Axios.post('/login', data)
        .then(res => {
          console.log('res==of ==login: ', res.data.user);
          localStorage.setItem('userInfo', JSON.stringify(res.data.user));
          toast({
            title: 'Logged In Successfully.',
            description: `${res.data.message}`,
            status: 'success',
            duration: 1000,
            isClosable: true,
          });
          navigate('/chat')
        })
        .catch(error => {
          console.error('Error occurred while making the POST request:', error.response.data.message);
          console.error(error.response.status);
          if(error.response.status){
            toast({
              title: 'Validation Error',
              description: error.response.data.message || 'Invalid password.',
              status: 'error',
              duration: 500,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Error',
              description:
                'Something went wrong. Please try again later.',
              status: 'error',
              duration: 500,
              isClosable: true,
            });
          }
          
        });
    } catch (error) {
      console.error('Error occurred during the POST request:', error);
      toast({
        title: 'Error',
        description:
        error.message || 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 500,
        isClosable: true,
      });
    }
  }
  

  return (
    <div className='container mt-5 bg-light p-4' style={{width:'500px'}}>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            className={`form-control ${
              touched.email && errors.email.trim() ? 'is-invalid' : ''
            }`}
            id='email'
            placeholder='Enter email'
            name='email'
            value={data.email}
            onChange={handleChange}
            required
          />
          {touched.email && <span className='text-danger'>{errors.email}</span>}
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            className={`form-control ${
              touched.password && errors.password.trim() ? 'is-invalid' : ''
            }`}
            id='password'
            placeholder='Enter password'
            name='password'
            value={data.password}
            onChange={handleChange}
            required
          />
          {touched.password && (
            <span className='text-danger'>{errors.password}</span>
          )}
        </div>

        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
