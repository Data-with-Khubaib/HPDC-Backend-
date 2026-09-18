// src/controllers/certificate.controller.js

const GetCertificatesQuery = require('../mediator/command/get-certificates.query');
const GetCertificateByIdQuery = require('../mediator/command/get-certificate-by-id.query');
const GetCertificateByApplicationIdQuery = require('../mediator/command/get-certificate-by-application-id.query');
const PayCertificateCommand = require('../mediator/command/pay-certificate.command');
const PayCertificateByApplicationCommand = require('../mediator/command/pay-certificate-by-application.command');
const ViewCertificateHtmlQuery = require('../mediator/command/view-certificate-html.query');
const SuspendCertificateCommand = require('../mediator/command/suspend-certificate.command');

class CertificateController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getAll(request, reply) {
    try {
      const isCompany = request.user.role === 'COMPANY';
      const companyId = isCompany ? request.user.companyId : undefined;
      const query = new GetCertificatesQuery({
        ...request.query,
        isCompany,
        companyId
      });
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getById(request, reply) {
    try {
      const query = new GetCertificateByIdQuery(request.params.id);
      const cert = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: cert });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getByApplication(request, reply) {
    try {
      const query = new GetCertificateByApplicationIdQuery(request.params.applicationId);
      const cert = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: cert });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async pay(request, reply) {
    try {
      const command = new PayCertificateCommand(request.params.id);
      const cert = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: cert });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async payByApplication(request, reply) {
    try {
      const command = new PayCertificateByApplicationCommand(request.params.applicationId);
      const cert = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: cert });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async viewCertificateHtml(request, reply) {
    try {
      const query = new ViewCertificateHtmlQuery(request.params.id);
      const html = await this.mediator.send(query);
      return reply.type('text/html').send(html);
    } catch (err) {
      return reply.code(err.statusCode || 500).send(`Error generating certificate: ${err.message}`);
    }
  }

  async suspend(request, reply) {
    try {
      const command = new SuspendCertificateCommand(request.params.id);
      const cert = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: cert });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = CertificateController;
