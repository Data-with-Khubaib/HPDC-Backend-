// src/services/log.service.js

class LogService {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  async getAll(filters) {
    return this.logRepository.findAll(filters);
  }

  /**
   * Manual event logging — for events NOT handled by DB triggers.
   * Examples: user login, terms accepted, document/certificate viewed.
   */
  async logEvent({ userId, applicationId, userName, actionText }) {
    return this.logRepository.createManualLog({
      userId,
      applicationId,
      userName,
      actionText,
    });
  }
}

module.exports = LogService;
