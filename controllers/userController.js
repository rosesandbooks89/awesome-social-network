const { User, Thought } = require("../models");

const userController = {
  // get all users
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
      res.status(400).json(err);
    }
  },
  //get a single user by id
  async getUserByID({ params }, res) {
    try {
      const dbUserData = await User.findById(params.id)
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
  //post a new user
  async createUser({ body }, res) {
    try {
      const dbUserData = await User.create(body);
      res.json(dbUserData);
      //if user already exists, send error
      if (dbUserData) {
        res.status(400).json({ message: "User already exists! Please Choose another username." });
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  //update a user by id
  async updateUser({ params, body }, res) {
    try {
        const dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, { 
            new: true, 
            runValidators: true 
        });
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
    },


  // add a friend to a user's friend list
async addFriend({ params }, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        { _id: params.id },
        { $push: { friends: params.friendId } },
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

  // delete a friend from a user's friend list
async deleteFriend({ params }, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        { _id: params.id },
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

  // delete a user by id, thoughts associated with user are deleted as well
async deleteUser({ params }, res) {
    try {
      const dbUserData = await User.findByIdAndDelete(params.id);
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
        // remove from user's thoughts array
        await Thought.deleteMany({ userId: params.id });
        res.json({ message: "User deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
      res.json(dbUserData);
  },
};
module.exports = userController;
