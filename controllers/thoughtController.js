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

// update thought by id
async updateThought({ params, body }, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(params.id, body, { new: true });
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
},

// delete thought by id
 async deleteThought({ params }, res) {
    try {
      const thought = await Thought.findByIdAndRemove(params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }
      // remove from user's thoughts array
      await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });
      res.json({ message: 'Thought deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
},
// add reaction to thought

async addReaction({ params, body }, res) {
    try {
        console.log("reaction:", params.thoughtID);
    const updatedThought = await Thought.findByIdAndUpdate(params.thoughtId, { $push: { reactions: body } }, { new: true });
    if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(updatedThought);
    } catch (err) {
    console.error(err);
    res.status(400).json(err);
    }
},
// delete reaction from thought
async deleteReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(params.thoughtId, { $pull: { reactions: { reactionId: params.reactionId } } }, { new: true });
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

module.exports = thoughtController;