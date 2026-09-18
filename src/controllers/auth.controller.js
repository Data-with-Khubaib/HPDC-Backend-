// src/controllers/auth.controller.js
const { success } = require('zod');
const LoginCommand = require('../mediator/command/login.command');
const RegisterCommand = require('../mediator/command/register.command');
const VerifyOtpCommand = require('../mediator/command/verify-otp.command');
const ResendOtpCommand = require('../mediator/command/resend-otp.command');
const RefreshCommand = require('../mediator/command/refresh.command');
const LogoutCommand = require('../mediator/command/logout.command');
const GetMeQuery = require('../mediator/command/get-me.query');
const ChangePasswordCommand = require('../mediator/command/change-password.command');
const GetUsersQuery = require('../mediator/command/get-users.query');
const UpdateUserCommand = require('../mediator/command/update-user.command');
const DeleteUserCommand = require('../mediator/command/delete-user.command');

class AuthController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async register(request, reply) {
    try {
      const command = new RegisterCommand(request.body);
      const user = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: user });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message });
    }
  }

  async login(request, reply) {
    try {
      const command = new LoginCommand(request.body);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async verifyOtp(request, reply) {
    try {
      const command = new VerifyOtpCommand(request.body);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async resendOtp(request, reply) {
    try {
      const command = new ResendOtpCommand(request.body);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async refresh(request, reply) {
    try {
      const command = new RefreshCommand(request.body);
      const tokens = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: tokens });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async logout(request, reply) {
    try {
      const command = new LogoutCommand(request.body);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async me(request, reply) {
    try {
      const query = new GetMeQuery(request.user.id);
      const result = await this.mediator.send(query);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async changePassword(request, reply) {
    try {
      const command = new ChangePasswordCommand(request.body, request.user.id);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getUsers(request, reply) {
    try {
      const query = new GetUsersQuery(request.query);
      const result = await this.mediator.send(query);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async updateUser(request, reply) {
    try {
      const command = new UpdateUserCommand(request.params.id, request.body);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async deleteUser(request, reply) {
    try {
      const command = new DeleteUserCommand(request.params.id);
      const result = await this.mediator.send(command);
      return reply.code(200).send(result);
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = AuthController;

