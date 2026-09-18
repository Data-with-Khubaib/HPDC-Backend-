class UpdateUserCommand {
  constructor(id, data) {
    this.id = id;
    this.name = data.name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.role = data.role;
    this.is_active = data.is_active;
  }
}
module.exports = UpdateUserCommand;
