const bcrypt = require('bcrypt');
const User = require('../models/user');
const comparePassword = require('../helpers/auth').comparePassword;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { createNotification } = require("../controller/notificationController");


const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmpassword, role } = req.body;

        
        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password should be at least 8 characters long',
            });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({
                error: "Passwords don't match",
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({
                error: 'Email is already taken',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        
        });

        await createNotification(user.id, 'Welcome! You have successfully registered.');

          // Set up Nodemailer
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ajinakaya5@gmail.com', 
                pass: 'clde iaoa nuvx yveh',   
            },
        });
        // Send confirmation email
        const mailOptions = {
            from: 'ajinakaya5@gmail.com',
            to: user.email, 
            subject: 'Welcome to Styelo!',
            html: `
                <h1>Welcome, ${user.username}!</h1>
                <p>Thank you for registering with our app.</p>
                
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        res.status(201).json({ message: 'User registered successfully. Email sent.', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log('email not found:', email);
            return res.status(404).json({
                error: 'No email found',
            });
        }

        const isPasswordMatch = await comparePassword(password, user.password);

        if (isPasswordMatch) {
            // Generate token
            const token = jwt.sign({ _id: user._id,role: user.role }, process.env.SECRET_KEY, {
                expiresIn: '1h', 
            });
            console.log('Generated Token:', token, 'role:',user.role);

            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true,
            });
            console.log('Login successful for:', email);
            return res.json({
                message: 'Login successful',
                token,
            });

        } else {
            console.log('Incorrect email or password for:', email);
            return res.status(401).json({
                error: 'Incorrect email or password',
            });
        }
    } catch (error) {
        console.log('Error during login:', error);
        return res.status(500).json({
            error: 'An error occurred during login',
        });
    }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'ajinakaya5@gmail.com',
        pass: 'clde iaoa nuvx yveh',
      },
    });

    const mailOptions = {
      from: 'Styelo <ajinakaya5@gmail.com>',
      to: user.email,
      subject: 'Styelo: Your Password Reset Code',
      html: `
        <h2>Enter this code to reset your password</h2>
        <h1>${resetCode}</h1>
        <p>This code will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Code sent to email' });
  } catch (error) {
    console.error('Error in forgetPassword:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


const imageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const image = req.file ? req.file.path : null;

        if (!image) {
            return res.status(400).json({ error: 'Invalid file uploaded' });
        }
        
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.image = image;
        await user.save();

        await createNotification(user._id, 'Your profile image has been updated.');

        res.status(200).json({ message: 'Image uploaded successfully', imageUrl: image });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};




module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    imageUpload,

    

};