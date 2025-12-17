import * as bcrypt from 'bcryptjs';

/**
 * Utility functions for password hashing and comparison
 * Provides reusable password operations across the application
 */
export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   * @param plainPassword - The plain text password to hash
   * @returns Promise resolving to the hashed password
   */
  static async hash(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword - The plain text password
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise resolving to true if passwords match, false otherwise
   */
  static async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Verify password strength (basic validation)
   * @param password - The password to validate
   * @returns Object with isValid flag and optional error message
   */
  static validateStrength(password: string): {
    isValid: boolean;
    error?: string;
  } {
    if (password.length < 8) {
      return {
        isValid: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter',
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain at least one lowercase letter',
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain at least one number',
      };
    }

    return { isValid: true };
  }
}
