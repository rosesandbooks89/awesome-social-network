const {Thought, User} = require('../models');

const thoughtController = {
//create new thought
async createThought({ body }, res) {
    try {
      const newThought = await Thought.create(body);
      await User.findByIdAndUpdate(body.userId, { $push: { thoughts: newThought._id } }, { new: true });
      res.json(newThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

// get all thoughts
async getAllThoughts(req, res) {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},

// get thought by id
async getThoughtById({ params }, res) {
    try {
        const thought = await Thought.findById(params.id);
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},



// create thought
// update thought by id
// delete thought by id
// add reaction to thought
// delete reaction from thought
