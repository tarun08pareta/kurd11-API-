const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// exports.verifyMobile = async (req, res) => {
//   console.log(req.body.mobileNumber);
//   try {
//     const { mobileNumber } = req.body.mobileNumber;
//     const validateNumber = await User.findOne({ mobileNumber: mobileNumber });
//     if (!req.body.mobileNumber) {
//       console.log("Mobile number is required.");
//       return res.status(400).send({ message: "Mobile number is required." });
//     } else if (!validateNumber) {
//       console.log("Mobile number is already in use!");
//       return res.status(400).send({ message: "Mobile number is already in use!" });
//     }

//     //TODO: Need to implement mobile number authentication and validation

//     // Update user object with mobile verification status
//     // await User.findOneAndUpdate({ mobileNumber }, { isMobileVerified: true });
//     let mobileVerified = true;    //temporary mobile verification
//     if (mobileVerified) {
//       let user = new User({
//         mobileNumber: req.body.mobileNumber,
//         isMobileVerified: true,
//       });

//       const mobileSaved = await user.save();
//       if (mobileSaved) {
//         console.log("Mobile number saved successfully.");
//       }
//       res.json({ message: 'Mobile number verified successfully. Proceed to the next step.' });
//     }


//   } catch (error) {
//     console.error("Error validating mobile number:", error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// }

exports.signup = async (req, res) => {
  console.log('req.body', req.body);

  try {
    if (!req.body.password) {
      return res.status(400).send({ message: "Password is required." });
    }

    let time = Date.now(); // current time in milliseconds
    let formatDateElements = formatLocalISO(new Date(time));

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      createdAt: formatDateElements,
    });

    const savedUser = await user.save();
// profile picture image uplode 
if(req.files){
  let path= ''
  req.files.forEach(function(files,index,arr){
    path = path + files.path +','
  })
  path =path.substring(0,path.lastIndexOf(","))
  user.profilePicture = path
}

// profile picture image uplode confirm 

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });

      savedUser.roles = roles.map((role) => role._id);
      await savedUser.save();

      res.send({ message: "User was registered successfully!" });
    } else {
      const role = await Role.findOne({ name: "user" });

      savedUser.roles = [role._id];
      await savedUser.save();

      res.send({ message: "User was registered successfully!" });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });

    // Save the new accessToken to the user in the database
    user.accessToken = token;
    await user.save();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // Use findByIdAndUpdate to update user data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run validators on update
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
    console.log(`User Updated Successfully: ${JSON.stringify(updatedUser)}`);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });

  }
}

// Functions to format date and time
function formatUTCOffset(minutes) {
  return (minutes >= 0 ? '+' : '-') + (Math.floor(Math.abs(minutes) / 60) + '').padStart(2, '0') + ':' + (Math.abs(minutes) % 60 + '').padStart(2, '0');
}

function formatDateElements(separator, ...elements) {
  return elements.map(x => (x + '').padStart(2, '0')).join(separator);
}

function formatLocalISO(date) {
  let isoDate = formatDateElements('-', date.getFullYear(), date.getMonth() + 1, date.getDate());
  isoDate += 'T' + formatDateElements(':', date.getHours(), date.getMinutes(), date.getSeconds());
  return isoDate + formatUTCOffset(-date.getTimezoneOffset());
}
