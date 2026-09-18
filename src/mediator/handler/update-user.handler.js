class UpdateUserCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    const updates = {
      name: command.name,
      email: command.email,
      phone_number: command.phone_number,
      role: command.role,
      is_active: command.is_active
    };
    // remove undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    
    const user = await this.authService.updateUser(command.id, updates);
    return { success: true, data: user };
  }
}
module.exports = UpdateUserCommandHandler;
