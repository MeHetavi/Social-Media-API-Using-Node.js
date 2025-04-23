const { User, Post, Like, Comment, postImages } = require('./models/index');
const sequelize = require('./config/db');

const createUser = async (userData) => {
    try {
        // Create user
        const user = await User.create(userData);
        return user.dataValues;
    }
    catch (error) {
        throw error;
    }
};
const getUserById = async (id) => {
    const user = await User.findByPk(id, { include: [{ model: Post, as: 'posts' }] });
    return user
};

const updateUser = async (user, userData) => {
    try {
        // Create user
        user.update(userData);
        return user;
    }
    catch (error) {
        throw error;
    }
};


const getPostById = (id) => {
    return Post.findByPk(id, { include: [{ model: postImages, as: 'images' }, { model: Like, as: 'likes' }, { model: Comment, as: 'comments' }] });
}

const getAllUsers = async () => {
    const users = await User.findAll({ include: [{ model: Post, as: 'posts', include: [{ model: postImages, as: 'images' }, { model: Like, as: 'likes' }, { model: Comment, as: 'comments' }] }] });;
    console.log(users)
    return users
}


const createPost = async (postData) => {
    const t = await sequelize.transaction();
    try {
        // Create user
        const post = await Post.create(postData, { transaction: t });
        const images = postData.images.map((image) => {
            return { postId: post.id, imageUrl: image }
        });
        await postImages.bulkCreate(images, { transaction: t });
        await t.commit();
        return getPostById(post.id);
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};

const editPost = async (post, postData) => {
    const t = await sequelize.transaction();
    try {
        // Create user
        await post.update(postData);
        await t.commit();
        return getPostById(post.id);
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};

const deletePost = async (id) => {
    try {
        // Create user
        const deleted = await Post.destroy({ where: { id: id } });
        return deleted;
    }
    catch (error) {
        throw error;
    }
};

const createLike = async (likeData) => {
    try {
        // Create user
        const like = await Like.create(likeData);
        return like;
    }
    catch (error) {
        throw error;
    }
};

const removeLike = async (likeData) => {
    try {
        // Create user
        const like = await Like.destroy({ where: likeData });

        return like;
    }
    catch (error) {
        throw error;
    }
};

const createComment = async (commentData) => {
    try {
        // Create user
        const comment = await Comment.create(commentData);
        return comment;
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    updateUser,
    getUserById,
    getAllUsers,
    getPostById,
    createPost,
    deletePost,
    editPost,
    createLike,
    removeLike,
    createComment
};
