import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

class AuthService {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  async register(userData) {
    console.log("🚀 ~ AuthService ~ registerUser ~ userData:", userData);
    try {
      // get email from userData
      const { email, username, password } = userData;

      // check if user already exists
      const existingUser = await this.UserRepository.findByIdentifier(email);

      // throw an error if user already exists
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // create user
      const user = await this.UserRepository.create({
        username,
        email,
        password: hashedPassword,
      });
      console.log("🚀 ~ AuthService ~ registerUser ~ user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(userData) {
    console.log("🚀 ~ AuthService ~ login ~ userData:", userData);
    try {
      const { identifier, password } = userData;

      // find user by email or username
      const user = await this.UserRepository.findByIdentifier(identifier, true);
      console.log("🚀 ~ AuthService ~ login ~ user:", user);

      if (!user) {
        throw new Error("User does not exist");
      }

      // check whether password is valid or not
      const isPasswordValid = await bcrypt.compare(password, user?.password);
      console.log(
        "🚀 ~ AuthService ~ login ~ isPasswordValid:",
        isPasswordValid
      );

      // if not throw error
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // return user
      console.log("🚀 ~ AuthService ~ login ~ user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(userRepository);
