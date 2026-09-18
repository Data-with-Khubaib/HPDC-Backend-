class AdminTakeActionCommand {
  constructor({ id, action, reason, adminId }) {
    this.id = id;
    this.action = action;
    this.reason = reason;
    this.adminId = adminId;
  }
}
module.exports = AdminTakeActionCommand;
