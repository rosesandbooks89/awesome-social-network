const { Thought, User } = require('../models');

const thoughtController = {
  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      )
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Fetch all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Fetch a specific thought by ID
  async getThoughtById({ params }, res) {
    try {
        console.log("Thought ID from Params:", params.id);
      const thought = await Thought.findById(params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Update a thought by ID
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

  // Delete a thought
  async deleteThought({ params }, res) {
    try {
      const thought = await Thought.findByIdAndRemove(params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }
      // Also remove from user's thoughts array
      await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });
      res.json({ message: 'Thought deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Add a reaction to a thought
  async addReaction({ params, body }, res) {
    try {
        console.log("reaction:", params.thoughtId);
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

  // Remove a reaction from a thought
  async removeReaction({ params }, res) {
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
