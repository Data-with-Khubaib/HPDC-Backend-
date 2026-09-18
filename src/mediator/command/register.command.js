class RegisterCommand {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone_number = data.phone_number;
    this.role = data.role;
    this.company_name = data.company_name;
    this.country = data.country;
    this.sector = data.sector;
    this.registration_number = data.registration_number;
    this.contact_person = data.contact_person;
  }
}
module.exports = RegisterCommand;