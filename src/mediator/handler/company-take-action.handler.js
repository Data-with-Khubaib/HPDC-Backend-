class CompanyTakeActionCommandHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(command) {
    return await this.applicationService.companyTakeAction(
      command.id,
      command.companyId, // this acts as user.id in the service args
      command.comment_text,
      command.document_url,
      command.document_name
    );
  }
}
module.exports = CompanyTakeActionCommandHandler;
