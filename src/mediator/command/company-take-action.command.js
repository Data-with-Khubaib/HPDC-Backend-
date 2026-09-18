class CompanyTakeActionCommand {
  constructor({ id, companyId, comment_text, document_url, document_name }) {
    this.id = id;
    this.companyId = companyId;
    this.comment_text = comment_text;
    this.document_url = document_url;
    this.document_name = document_name;
  }
}
module.exports = CompanyTakeActionCommand;
