require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jtw = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email Exists!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            })
                    }
                });
            }
        });
};

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed!'
                });
            }
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed!'
                    });
                }
                if (result) {
                    const token = jtw.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth Successful!',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth Failed!'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.users_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result.n === 0) {
                res.status(404).json({
                    message: 'User not found'
                });
            } else {
                res.status(200).json({
                    message: 'User deleted'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};