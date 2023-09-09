const { User, Thought } = require("../models");

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Get a single user by its _id and populated thought and friend data
  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");

      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // POST a new user
  async createUser({ body }, res) {
    try {
      const dbUserData = await User.create(body);
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Update a user by its _id
  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      });

      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // Add a new friend to a user's friend list
async addFriend({ params }, res) {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        );

        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id!" });
            return;
        }

        res.json(dbUserData);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},

// Remove a friend from a user's friend list
async removeFriend({ params }, res) {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        );

        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id!" });
            return;
        }

        res.json(dbUserData);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},

  // DELETE to remove user by its _id and associated thoughts
  async deleteUser({ params }, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.id });

      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }

      // BONUS: Remove a user's associated thoughts when deleted.
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
