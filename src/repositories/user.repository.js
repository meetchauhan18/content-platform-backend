import User from "../models/User.js";

class UserRepository {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async create(userData) {
    return this.User.create(userData);
  }

  async findByIdentifier(identifier, selectPassword = false) {
    const query = this.User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });

    if (selectPassword) {
      query.select("+password");
    }

    return query;
  }

  async findById(id) {
    return this.User.findById(id);
  }
}

// // Pattern 2 User Repository using Object Literals

// const UserRepository = {
//   create: async (userData) => {
//     return await User.create(userData);
//   },
//   findByEmail: async (email) => {
//     return await User.findOne({ email: email.toLowerCase() });
//   },
//   findById: async (id) => {
//     return await User.findById(id);
//   },
// };

export default new UserRepository(User);
