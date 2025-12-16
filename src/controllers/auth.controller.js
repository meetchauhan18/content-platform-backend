import authService from "../services/auth.service.js";

class AuthController {
  constructor(AuthService) {
    this.AuthService = AuthService;
    // Bind methods to preserve 'this' context when destructured
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res) {
    try {
      const user = await this.AuthService.register(req.body);
      console.log("🚀 ~ AuthController ~ user:", user);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const user = await this.AuthService.login(req.body);
      console.log("🚀 ~ AuthController ~ user:", user);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController(authService);
