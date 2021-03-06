import database from '../../database';

import RequestError from '../../lib/RequestError';

const {
  User: userModel,
  Follower: followerModel,
  Post: postModel,
} = database.models;

export default class UserService {
  static async addFollowerForUser(followerId, targetId) {
    try {
      const follower = await followerModel.findAll({
        where: { followerId, targetId },
      });

      if (follower.length) {
        throw new Error('Follower already send request to the user');
      }

      await followerModel.create({
        followerId,
        targetId,
        status: 'pending',
      });
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async createUser(userData) {
    try {
      const { username, password, email } = userData;

      const user = await userModel.create({ username, password, email });

      return user;
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async deleteUsers() {
    try {
      await userModel.destroy({ where: {} });
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async deleteUserById(userId) {
    try {
      await this.findUserById(userId);
      await userModel.destroy({ where: { id: userId } });
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async findAllUsers() {
    try {
      const userList = await userModel.findAll();

      return userList;
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async findUserById(userId) {
    try {
      const user = await userModel.findByPk(userId);

      if (user === null) {
        throw new Error(`User with id ${userId} doesn't exist.`);
      }

      return user;
    } catch (err) {
      throw new RequestError(err, 404);
    }
  }

  static async getUserPosts(authorId) {
    try {
      const user = await this.findUserById(authorId);
      const userPostList = postModel.findAll({ where: { authorId: user.id } });

      return userPostList;
    } catch (err) {
      throw new RequestError(err, 404);
    }
  }

  static async getFollowersByUserId(userId) {
    try {
      const user = await this.findUserById(userId);
      const followers = await followerModel.findAll({
        where: { targetId: user.id },
      });

      return followers;
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }

  static async updateUserById(userId, userUpdateBody) {
    try {
      const user = await this.findUserById(userId);
      const updatedUser = await userModel.update(userUpdateBody, {
        where: { id: user.id },
      });

      return updatedUser;
    } catch (err) {
      throw new RequestError(err, 500);
    }
  }
}
