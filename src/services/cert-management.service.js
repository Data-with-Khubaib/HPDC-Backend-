// src/services/cert-management.service.js

class CertManagementService {
  constructor(certManagementRepository) {
    this.certManagementRepository = certManagementRepository;
  }

  async getAll(filters) {
    const result = await this.certManagementRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((item) => ({
        ...item,
        application_fee: item.application_fee?.toString(),
        certificate_fee: item.certificate_fee?.toString(),
      })),
    };
  }

  async getById(id) {
    const item = await this.certManagementRepository.findById(id);
    if (!item) {
      throw { statusCode: 404, message: 'Certificate type not found' };
    }
    return {
      ...item,
      application_fee: item.application_fee?.toString(),
      certificate_fee: item.certificate_fee?.toString(),
    };
  }

  async create(data) {
    return this.certManagementRepository.create({
      certificate_name: data.certificate_name,
      duration: data.duration,
      application_fee: BigInt(data.application_fee),
      certificate_fee: BigInt(data.certificate_fee),
      status: data.status,
    });
  }

  async update(id, data) {
    const existing = await this.certManagementRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Certificate type not found' };
    }

    const updateData = {};
    if (data.certificate_name !== undefined) updateData.certificate_name = data.certificate_name;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.application_fee !== undefined) updateData.application_fee = BigInt(data.application_fee);
    if (data.certificate_fee !== undefined) updateData.certificate_fee = BigInt(data.certificate_fee);
    if (data.status !== undefined) updateData.status = data.status;

    return this.certManagementRepository.update(id, updateData);
  }

  async delete(id) {
    const existing = await this.certManagementRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Certificate type not found' };
    }
    return this.certManagementRepository.delete(id);
  }
}

module.exports = CertManagementService;
