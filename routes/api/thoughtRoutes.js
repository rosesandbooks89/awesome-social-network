const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thoughtController');

// Route to get all thoughts
router.route('/').get(getAllThoughts);

// Route to get a single thought by ID, update a thought, or delete a thought
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

// Route to create a new thought associated by user)
router.route('/user/:userId').post(createThought);

// Routes to add reactions on a thought
router.route('/:thoughtId/reactions').post(addReaction);

// Routes to remove reactions on a thought
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;