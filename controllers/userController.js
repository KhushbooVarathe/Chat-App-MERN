const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const generateToken = require('../config/generateToken')
const backend = process.env.Backend_Url

const register = async (req, res) => {
  console.log('req: ', req)
  try {
    console.log(req.body, 'requesttttttttttttttttt')
    const { name, email, password, photo, number } = req.body
    console.log('photo: ', req.file)

    if (!name || !email || !password || !number) {
      return res
        .status(400)
        .json({ success: false, message: 'Please Enter all the Fields' })
    }

    const userExists = await userModel.findOne({ email })

    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'User with this email already exists'
        })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      number,
      picture: req.file
        ? req.file.path
        : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    })

    if (user) {
      // let Token = generateToken(user._id)
      // // console.log('Token: ', Token);
      // user.refreshToken = Token
      // await user.save()
      return res.status(201).json({
        success: true,
        message: 'Account created Successfully'
      })
    } else {
      return res.status(400).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    console.error('Error in registration:', error)
    return res.status(500).json({ success: false, message: ' server error' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user by email in the database
    const user = await userModel.findOne({ email })
    console.log('user: ', user)
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }
    
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return res
      .status(400)
      .json({ success: false, message: 'Invalid password' })
    }
    
    let AccessToken = generateToken(user._id)

    if(user.picture == 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'){
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: AccessToken
        }
      })
    }else{
      // If email and password match, user login is successful

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: `${backend}/${user.picture}`,
          token: AccessToken
        }
      })
    }
  } catch (error) {
    console.error('Error in login:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
}

// const allUsers = async (req, res) => {
//   const nameKeyword = req.query.name;
//   const emailKeyword = req.query.email;

//   let filter = {};

//   if (nameKeyword && typeof nameKeyword === 'string') {
//     filter.name = { $regex: nameKeyword, $options: 'i' };
//   }

//   if (emailKeyword && typeof emailKeyword === 'string') {
//     filter.email = { $regex: emailKeyword, $options: 'i' };
//   }

//   console.log('Filter:', JSON.stringify(filter, null, 2));

//   try {
//     const users = await userModel.find(filter);
//     res.send(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).send('Error fetching users');
//   }
// };

// const allUsers = async (req, res) => {
//   // console.log('reqeeeeeeeeeeeeeeeeeeeeeeeeee: ', req.user);
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.send(users);
// };

const allUsers = async (req, res) => {
  try {
    let aggregationPipeline = [];
    if (req.query.search) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      });
    }

      // Exclude the current user from the aggregation
      aggregationPipeline.push({
        $match: {
          _id: { $ne: req.user._id }
        }
      });

    // Grouping users based on some criteria
    aggregationPipeline.push({
      $group: {
        _id: "$someFieldToGroup", // Change this field based on your criteria
        users: { $push: "$$ROOT" }
      }
    });

    // Execute the aggregation pipeline
    const users = await userModel.aggregate(aggregationPipeline);
    
    console.log('users: ', users);
    if (!users || users.length === 0) {
      return res.status(404).send('User not found');
    }

    res.send(users[0].users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// const allUsers = async (req, res) => {
//   try {
//     console.log('req: ', req);
//     const keyword = req.query.search
//       ? {
//           $or: [
//             { name: { $regex: req.query.search, $options: "i" } },
//             { email: { $regex: req.query.search, $options: "i" } },
//           ],
//         }
//       : {};

//     const users = await userModel.find({ ...keyword, _id: { $ne: req.user._id } }).select('-password');
//     console.log('users: ', users);y
//     res.send(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

module.exports = { register, login, allUsers }
