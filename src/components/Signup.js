import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import Axios from '../axiosInstance/AxiosIndex';
import { useToast } from '@chakra-ui/react';

function Signup() {
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    number: '',
    image: null,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    number: '',
    image: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    cpassword: false,
    number: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === 'name') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value.length < 3) {
        setErrors({
          ...errors,
          [name]: 'contains at least 3 characters',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Fill valid email',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    } else if (name === 'password') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value.length < 6) {
        setErrors({
          ...errors,
          [name]: 'password must contain at least 6 characters',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    } else if (name === 'cpassword') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (
        value.length < 6 ||
        value.length !== data.password.length ||
        value.length < data.password.length
      ) {
        setErrors({
          ...errors,
          [name]:
            'password must contain at least 6 characters and must be same as password',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    } else if (name === 'number') {
      if (!value) {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value.length !== 10) {
        setErrors({
          ...errors,
          [name]: 'Number should contain 10 digits',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    }
    if (name === 'image') {
      setData({ ...data, [name]: e.target.files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data, 'data');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('number', data.number);
    formData.append('image', data.image);
    console.log('formData: ', formData);

    Axios.post('/register', formData)
      .then((res) => {
        console.log('res: ', res.data);
        toast({
          title: 'Account created.',
          description: `${res.data.message}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate('/login')
      })
      .catch((err) => {
        if (err.response) {
          const {
            status,
            data: { message },
          } = err.response;

          if (status === 400) {
            toast({
              title: 'Validation Error',
              description: message || 'User with this email already exists.',
              status: 'error',
              duration: 500,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Error',
              description:
                message || 'Something went wrong. Please try again later.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        } else if (err.request) {
          console.error('No response received:', err.request);
          toast({
            title: 'Error',
            description: 'No response received from the server.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          console.error('Error:', err.message);
          toast({
            title: 'Error',
            description:
              err.message || 'Something went wrong. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      });
  }

  function handleChange1(value, countryData) {
    setTouched({ ...touched, number: true });

    if (!value) {
      setErrors({
        ...errors,
        number: 'This field is required',
      });
    } else {
      const countryCodeLength = countryData?.countryCallingCode
        ? countryData.countryCallingCode.length
        : 0;
      const numberWithoutCountryCode = value
        .slice(countryCodeLength)
        .replace(/\s/g, '');

      const error =
        numberWithoutCountryCode.length < 8 ||
          numberWithoutCountryCode.length > 15
          ? 'Please enter a valid number'
          : '';

      setErrors({ ...errors, number: error });
      setData({
        ...data,
        number: numberWithoutCountryCode,
        country: countryData,
      });
    }
  }

  return (
    <>
      <div>
        <div className='bg-light p-3'>
          <form
            action="/uploadregister"
            className='text-dark'
            encType="multipart/form-data" method="post"

          >
            <div className='form-group'>
              <label htmlFor='name'>Full Name:</label>
              <input
                type='text'
                className={`form-control ${touched.name && errors.name.trim() ? 'is-invalid' : ''
                  }`}
                id='name'
                placeholder='Enter name'
                name='name'
                value={data.name}
                onChange={handleChange}
                onBlur={handleChange}
                required
              />
              {touched.name && (
                <span className='text-danger'>{errors.name}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                className={`form-control ${touched.email && errors.email.trim() ? 'is-invalid' : ''
                  }`}
                id='email'
                placeholder='Enter email'
                name='email'
                value={data.email}
                onChange={handleChange}
                onBlur={handleChange}
                required
              />
              {touched.email && (
                <span className='text-danger'>{errors.email}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                className={`form-control ${touched.password && errors.password.trim() ? 'is-invalid' : ''
                  }`}
                id='password'
                placeholder='Enter password'
                name='password'
                value={data.password}
                onChange={handleChange}
                onBlur={handleChange}
                required
              />
              {touched.password && (
                <span className='text-danger'>{errors.password}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='cpassword'>Confirm password:</label>
              <input
                type='password'
                className={`form-control ${touched.cpassword && errors.cpassword.trim()
                  ? 'is-invalid'
                  : ''
                  }`}
                id='cpassword'
                placeholder='Confirm password'
                name='cpassword'
                value={data.cpassword}
                onChange={handleChange}
                onBlur={handleChange}
                required
              />
              {touched.cpassword && (
                <span className='text-danger'>{errors.cpassword}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='number'>Phone Number :</label>
              <PhoneInput
                country={'us'}
                className={`form-group ${touched.number && errors.number.trim() ? 'is-invalid' : ''
                  }`}
                inputStyle={{ width: '451px' }}
                inputProps={{ required: true }}
                id='number'
                placeholder='Enter Number'
                name='number'
                value={data.number}
                onChange={handleChange1}
                required
              />
              {touched.number && (
                <span className='text-danger'>{errors.number}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='image'>Image:</label>
              <input
                type='file'
                className='form-control-file'
                id='image'
                name='image'
                onChange={handleChange}
                accept='image/*'
              />
            </div>

            <button type='submit' className='btn btn-primary' onClick={handleSubmit}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
