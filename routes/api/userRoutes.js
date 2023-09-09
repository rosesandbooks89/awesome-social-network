const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/userController');

// Route to get all users
router.route('/').get(getAllUsers).post(createUser);

// Route to get a single user by ID, update a user, or delete a user
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// Route to add a friend to a user's friend list
router.route('/:userId/friends/:friendId').post(addFriend);

// Route to remove a friend from a user's friend list
router.route('/:userId/friends/:friendId').delete(removeFriend);

module.exports = router;