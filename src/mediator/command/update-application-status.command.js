class UpdateApplicationStatusCommand {
  constructor({ id, status, reason, adminId }) {
    this.id = id;
    this.status = status;
    this.reason = reason;
    this.adminId = adminId;
  }
}
module.exports = UpdateApplicationStatusCommand;
