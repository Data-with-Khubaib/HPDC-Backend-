// src/services/company.service.js

class CompanyService {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async getAll(filters) {
    const result = await this.companyRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((c) => this._serialize(c)),
    };
  }

  async getById(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw { statusCode: 404, message: 'Company not found' };
    }
    return this._serialize(company);
  }

  async getByUserId(userId) {
    const company = await this.companyRepository.findByUserId(userId);
    if (!company) {
      throw { statusCode: 404, message: 'Company not found for this user' };
    }
    return this._serialize(company);
  }

  async getCompanyDetailByAppId(applicationId) {
    const detail = await this.companyRepository.findCompanyDetailByAppId(applicationId);
    if (!detail) {
      throw { statusCode: 404, message: 'Company detail not found for this application' };
    }
    return detail;
  }

  async createCompanyDetail(data) {
    return this.companyRepository.createCompanyDetail(data);
  }

  async createBrand(data) {
    return this.companyRepository.createBrand(data);
  }

  async createSubBrand(data) {
    return this.companyRepository.createSubBrand(data);
  }

  async createAddress(data) {
    return this.companyRepository.createAddress(data);
  }

  async createESGDetails(data) {
    return this.companyRepository.createESGDetails(data);
  }

  _serialize(company) {
    if (!company) return company;
    return {
      ...company,
      phone_number: company.phone_number?.toString(),
      registration_number: company.registration_number?.toString(),
    };
  }
}

module.exports = CompanyService;
