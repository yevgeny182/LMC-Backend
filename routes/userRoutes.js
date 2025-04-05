const express = require('express');
const router = express.Router();
const registerModel = require('../models/register');
const bcrypt = require('bcrypt');

// fetch all users from DB
router.get('/users', async (req, res) => {
    try {
        const users = await registerModel.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
});
// delete users from DB
router.delete('/users/:id', async (req, res)  => {
    try{
        const userId = req.params.id;
        const deletedUser = await registerModel.findByIdAndDelete(userId);
        console.lo
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
// Push data into DB API
router.post('/RegisterUser', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); //encryptor
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            status: true,
            role: req.body.role
        };
        const user = await registerModel.create(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//authentication API
router.post('/LoginUser', async (req, res) => {
    try {
        const user = await registerModel.findOne({ email: req.body.email });
        if (user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                return res.json({ message: 'Login successful', user });
            } else {
                return res.status(401).json({ message: 'Wrong password' });
            }
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//update API
router.put('/users/:id', async(req, res) => {
    try{
        const userId = req.params.id;
        const updatedData ={
            name: req.body.name,
            email: req.body.email,
            password: req.body. password ? await bcrypt.hash(req.body.password, 10) : undefined,
            role: req.body.role,
            status: req.body.status
        }
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
        const updatedUser = await registerModel.findByIdAndUpdate(userId, updatedData, { new: true });
        if(!updatedUser){
            return res.status(404).json({message: 'user not found'})
        }
        res.status(200).json(updatedUser);
    }catch (err) {

    }
})

module.exports = router;