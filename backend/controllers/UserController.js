const { default: mongoose, Schema } = require("mongoose");
const createToken = require("../helpers/createToken");
const User = require("../Models/User");
const bcryptjs = require('bcryptjs');
const removeFile = require("../helpers/removeFile");

const UserController = {
    me : async (req, res) => {
        return res.json(req.user);
    },
    getUserById : async (req, res) => {
        try {
            let id = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }

            let user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg : 'user not found'})
            }
            
            return res.json(user);
        } catch (e) {
            return res.status(400).json({ error: e.message});
        }
    },
    login : async (req, res) => {
        try {
            let { email, password } = req.body;
            let user = await User.login(email, password);

            let token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 });

            return res.json({user, token});
        } catch (e) {
            return res.status(400).json({ error: e.message});
        }
    },
    register : async (req, res) => {
        try {
            let { name, email, password } = req.body;
            let user = await User.register(name, email, password);

            let token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 });
                
            return res.json({user,token});
        } catch (e) {
            return res.status(400).json({ error: e.message});
        }
    },
    update : async (req, res) => {
        try {
            let id = req.params.id;
            let { name, email, password} = req.body;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg : 'User not found'});
            };

            if(password) {
                const salt = await bcryptjs.genSalt();
                password = await bcryptjs.hash(password, salt);
            };

            let updatedUser = await User.findByIdAndUpdate( id, {
                name,
                email,
                password
            }, {new : true});

            if(!updatedUser) {
                return res.status(500).json({ msg : 'Failed to update user'});
            };  

            let token;
            if(req.user && req.user._id === id) {
                token = createToken(updatedUser._id);
                res.cookie('jwt', token, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 });
            };

            await removeFile( __dirname + '/../public/users/' + updatedUser.photo);

            return res.json({updatedUser,token});
        } catch (e) {
            return res.status(400).json({ error: e.message});
        }
    },
    destroy : async (req, res) => {
        try {
            let id = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let user = await User.findByIdAndDelete(id);

            if(!user) {
                return res.status(404).json({ msg : 'User not found'});
            }

            return res.json(user);
        } catch (e) {
            return res.status(400).json({ error: e.message});
        }
    },
    upload : async (req, res) => {
        try {
            let id = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(401).json({ msg : 'not a valid id'});
            }

            let user = await User.findByIdAndUpdate(id, {
                photo : '/' + req.file.filename
            })

            if(!user) {
                return res.status(404).json({ msg : 'user not found'});
            }

            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    logout : async (req, res) => {
        res.cookie('jwt', '', { maxAge : 1 });
        return res.json({ msg : 'user logged out successfully!'});
    },
}

module.exports = UserController;