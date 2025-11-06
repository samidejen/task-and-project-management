import { Request, Response } from "express";
import { User, UserAttributes } from "../models/User";
import { Role } from "../middleware/rbac";
import jwt from "jsonwebtoken";

const generateToken = (id: number, role: Role): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined.");

  return jwt.sign({ id, role }, secret, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
    return;
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const count = await User.count();
    const role = count === 0 ? Role.Admin : Role.Employee;

    const user = await User.create({
      firstName: "", // default
      lastName: "", // default
      email,
      passwordHash: password,
      role,
    } as UserAttributes);

    const token = generateToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await User.comparePassword(password, user.passwordHash))) {
      const token = generateToken(user.id, user.role);

      const userResponse = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      // Set JWT as httpOnly cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .json({ user: userResponse }); // send only user info
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (Protected by 'protect' middleware)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  // AuthRequest interface ensures req.user is populated by protect middleware
  const userId = (req as any).user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstName", "lastName", "email", "role"],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
