export const validatePassword = (password: string, hashedPassword: string): boolean => {
  return password.trim() === hashedPassword.trim();
};
