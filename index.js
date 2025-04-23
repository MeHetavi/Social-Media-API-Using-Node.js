const cors = require('cors');
const express = require('express');
const db = require('./db');
const app = express();
const path = require('path');
const sequelize = require('./config/db');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./models/index');
const verifyToken = require('./verifyToken');
const { uploadPosts } = require('./postMiddleware');
const { uploadAvatar } = require('./avatarMiddleware');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/user', verifyToken, async (req, res) => {
    res.json(req.user);
});

// POST /signup
app.post('/signup', uploadAvatar, async (req, res) => {
    try {
        const userData = {
            'fullName': req.body.fullName,
            'username': req.body.username,
            'password': bcrypt.hashSync(req.body.password, 8),
            'email': req.body.email,
            'dob': req.body.dob,
            'gender': req.body.gender,
            'avatarUrl': req.file ? `/uploads/avatars/${req.file.filename}` : null
        }
        let jwtSecretKey = "fsdjfsldkj34#$%#$%#$%#$5#$%#$5jslf!@#@!#!2132";
        let user = await db.createUser(userData);
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
        }, jwtSecretKey, { expiresIn: '10d' })
        user = { ...user, token: token }
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message,
            detail: error.errors?.map(err => (
                {
                    field: err.path,
                    message: err.message
                }
            ))
        });
    }
});

// POST /login
app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ where: { username: req.body.username } }).then(user => user.dataValues);
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            let jwtSecretKey = "fsdjfsldkj34#$%#$%#$%#$5#$%#$5jslf!@#@!#!2132";
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username
            }, jwtSecretKey, { expiresIn: '10d' })
            user = { ...user, token: token }
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

// PUT /user -> Edit user.
app.put('/user', uploadAvatar, verifyToken, async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            let userData = req.body;
            if (req.file) {
                if (user.avatarUrl) fs.unlinkSync(path.join(__dirname, user.avatarUrl));
                userData.avatarUrl = `/uploads/avatars/${req.file.filename}`
            };
            const updatedUser = await db.updateUser(user, userData);
            res.json({ "message": 'User updated Successfully!', "user": updatedUser });
        } else {
            res.status(500).json({ "error": 'User not found' });
        }
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            message: error.errors?.map(err => (
                {
                    field: err.path,
                    message: err.message
                }
            ))
        });
    }
});

// Post /post -> Create Post.
app.post('/post', verifyToken, uploadPosts, async (req, res) => {
    try {
        const images = req.files.map((file) => {
            return `/uploads/posts/${file.filename}`;
        });

        const postData = {
            userId: req.user.id,
            caption: req.body.caption,
            images: images
        };

        const post = await db.createPost(postData);
        res.status(201).json(post);
    } catch (error) {
        console.error(error); // Debug log
        res.status(400).json({ error: error.message });
    }
});

// PUT /post -> Update Post.
app.put('/post/:id', verifyToken, uploadPosts, async (req, res) => {
    try {
        const post = await db.getPostById(req.params.id);
        if (post === null || post.userId !== req.user.id) {
            res.status(500).json({ "error": 'Post not found' });
        }
        const images = req.files.map((file) => {
            return `/uploads/posts/${file.filename}`
        })
        const postData = {
            'caption': req.body.caption,
        }
        const updatedPost = await db.editPost(post, postData);
        res.status(201).json(updatedPost);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /post -> Delete Post.
app.delete('/post/:id', verifyToken, async (req, res) => {
    try {
        const post = await db.getPostById(req.params.id);
        if (post == null || post.userId != req.user.id) {
            res.status(500).json({ "error": 'Post not found.' });
        }
        else {

            const images = post.images;
            const deletedPost = await db.deletePost(req.params.id);
            if (!deletedPost) {
                res.status(400).json({ "error": 'Post not foundaaaaaaaa.' });
            }
            images.forEach((image) => {
                console.log(image.dataValues.imageUrl)
                fs.unlinkSync(path.join(__dirname, image.dataValues.imageUrl));
            });
            res.status(201).json({ "message": 'Post deleted Successfully!' });
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

// GET /allUsers
app.get('/allUsers', verifyToken, async (req, res) => {
    const users = await db.getAllUsers();
    res.json(users);
})

// POST /like/:id
app.post('/like/:id', verifyToken, async (req, res) => {
    try {
        const likeData = {
            forPost: req.params.id,
            createdBy: req.user.id
        }
        const like = await db.createLike(likeData);
        res.json({ 'message': 'Liked Successfully!', 'Data': like });
    }
    catch (error) {
        res.status(400).json({ 'message': 'Already Liked!' });
    }
})

// DELETE /like/:id
app.delete('/like/:id', verifyToken, async (req, res) => {
    try {

        const likeData = {
            forPost: req.params.id,
            createdBy: req.user.id
        }
        const like = await db.removeLike(likeData);
        console.log(like)
        if (!like) {
            res.status(400).json({ 'message': 'Liked not found!' });
        }
        res.json({ 'message': 'Liked removed!' });
    }
    catch (error) {
        res.status(400).json({ 'message': 'Already Liked!' });
    }
}
)

// POST /comment/:id
app.post('/comment/:id', verifyToken, async (req, res) => {
    const likeData = {
        forPost: req.params.id,
        comment: req.body.comment,
        createdBy: req.user.id
    }
    const comment = await db.createComment(likeData);
    res.json({ 'message': 'Commented Successfully!', 'Data': comment });
})

const port = process.env.PORT || 3000;
sequelize.sync({
    alter: false
}).then(async () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}!`);
    });
});
