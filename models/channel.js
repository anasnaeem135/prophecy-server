const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

userSchema.statics.isThisEmailInUse = async function (email) {
  if (email) {
    try {
      const user = await this.findOne({ email: email });
      if (user) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
  throw new Error("Invalid Email or Phone Number");
};

const UserSchema = mongoose.model("users", userSchema);

(module.exports = UserSchema), userSchema;
