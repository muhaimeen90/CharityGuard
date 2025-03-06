import prisma from "../config/prisma.js";

export class UserService {
  /**
   * Find a user by their ID
   */
  static async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Find a user by their email
   */
  static async findByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find a user by their wallet address
   */
  static async findByWalletAddress(address) {
    try {
      const user = await prisma.user.findFirst({
        where: { 
          smartWalletAddress: address 
        }
      });
      return user;
    } catch (error) {
      console.error('Error finding user by wallet address:', error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  static async updateUser(id, updateData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData
      });
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * List users with pagination
   */
  static async listUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          smartWalletAddress: true,
          role: true,
          createdAt: true
        }
      });
      
      const total = await prisma.user.count();
      
      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}