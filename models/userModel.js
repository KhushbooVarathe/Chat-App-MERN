const mongoose = require('mongoose')
const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    number: { type: String, required: true },

    password: { type: String, required: true },

    picture: {
      type: String,

      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },

    isAdmin: {
      type: Boolean,

      default: false
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model('user', userModel)
