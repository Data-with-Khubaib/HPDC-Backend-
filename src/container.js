// src/container.js
// Centralized Dependency Injection Container

const prisma = require('./config/prisma');
const wsPool = require('./config/websocket');
const mailer = require('./config/mailer');

// Repositories
const AuthRepository = require('./repositories/auth.repository');
const DashboardRepository = require('./repositories/dashboard.repository');
const ApplicationRepository = require('./repositories/application.repository');
const CommentRepository = require('./repositories/comment.repository');
const CertificateRepository = require('./repositories/certificate.repository');
const LogRepository = require('./repositories/log.repository');
const CompanyRepository = require('./repositories/company.repository');
const SurveyRepository = require('./repositories/survey.repository');
const CertManagementRepository = require('./repositories/cert-management.repository');

// Services
const AuthService = require('./services/auth.service');
const DashboardService = require('./services/dashboard.service');
const ApplicationService = require('./services/application.service');
const CommentService = require('./services/comment.service');
const CertificateService = require('./services/certificate.service');
const LogService = require('./services/log.service');
const CompanyService = require('./services/company.service');
const SurveyService = require('./services/survey.service');
const CertManagementService = require('./services/cert-management.service');

// Controllers
const AuthController = require('./controllers/auth.controller');
const DashboardController = require('./controllers/dashboard.controller');
const ApplicationController = require('./controllers/application.controller');
const CommentController = require('./controllers/comment.controller');
const CertificateController = require('./controllers/certificate.controller');
const LogController = require('./controllers/log.controller');
const CompanyController = require('./controllers/company.controller');
const SurveyController = require('./controllers/survey.controller');
const CertManagementController = require('./controllers/cert-management.controller');

// src/container.js mein ye imports add karein:
const Mediator = require('./mediator/mediator');
const createValidationBehavior = require('./mediator/behaviors/validation.behavior');

// Schemas
const { 
  loginSchema, registerSchema, verifyOtpSchema,
  resendOtpSchema, refreshSchema, changePasswordSchema,
  getUsersSchema, updateUserSchema, deleteUserSchema
} = require('./schemas/auth.schema');
const {
  submitApplicationSchema, getApplicationsSchema, getApplicationByIdSchema,
  adminTakeActionSchema, companyTakeActionSchema, updateApplicationStatusSchema,
  getApplicationDocumentsSchema
} = require('./schemas/application.schema');
const {
  getCertificatesSchema, getCertificateByIdSchema, getCertificateByApplicationIdSchema,
  payCertificateSchema, payCertificateByApplicationSchema, viewCertificateHtmlSchema,
  suspendCertificateSchema
} = require('./schemas/certificate.schema');
const {
  getCertTypesSchema, getCertTypeByIdSchema, createCertTypeSchema,
  updateCertTypeSchema, deleteCertTypeSchema
} = require('./schemas/cert-management.schema');
const { getCommentsSchema, postCommentSchema, editCommentSchema } = require('./schemas/comment.schema');
const { getCompaniesSchema, getCompanyByIdSchema, getMyCompanySchema, getCompanyDetailSchema, createCompanyDetailSchema } = require('./schemas/company.schema');
const { getDashboardMetricsSchema, getCompanyMetricsSchema, getAdminMetricsSchema } = require('./schemas/dashboard.schema');
const { getLogsSchema, logEventSchema } = require('./schemas/log.schema');
const { getSurveysSchema, getSurveyByIdSchema, submitAnswersSchema, getAnswersByApplicationSchema } = require('./schemas/survey.schema');

// Commands
const LoginCommand = require('./mediator/command/login.command');
const RegisterCommand = require('./mediator/command/register.command');
const VerifyOtpCommand = require('./mediator/command/verify-otp.command');
const ResendOtpCommand = require('./mediator/command/resend-otp.command');
const RefreshCommand = require('./mediator/command/refresh.command');
const LogoutCommand = require('./mediator/command/logout.command');
const GetMeQuery = require('./mediator/command/get-me.query');
const ChangePasswordCommand = require('./mediator/command/change-password.command');
const GetUsersQuery = require('./mediator/command/get-users.query');
const UpdateUserCommand = require('./mediator/command/update-user.command');
const DeleteUserCommand = require('./mediator/command/delete-user.command');

const SubmitApplicationCommand = require('./mediator/command/submit-application.command');
const GetApplicationsQuery = require('./mediator/command/get-applications.query');
const GetApplicationByIdQuery = require('./mediator/command/get-application-by-id.query');
const AdminTakeActionCommand = require('./mediator/command/admin-take-action.command');
const CompanyTakeActionCommand = require('./mediator/command/company-take-action.command');
const UpdateApplicationStatusCommand = require('./mediator/command/update-application-status.command');
const GetApplicationDocumentsQuery = require('./mediator/command/get-application-documents.query');

const GetCertificatesQuery = require('./mediator/command/get-certificates.query');
const GetCertificateByIdQuery = require('./mediator/command/get-certificate-by-id.query');
const GetCertificateByApplicationIdQuery = require('./mediator/command/get-certificate-by-application-id.query');
const PayCertificateCommand = require('./mediator/command/pay-certificate.command');
const PayCertificateByApplicationCommand = require('./mediator/command/pay-certificate-by-application.command');
const ViewCertificateHtmlQuery = require('./mediator/command/view-certificate-html.query');
const SuspendCertificateCommand = require('./mediator/command/suspend-certificate.command');

const GetCertTypesQuery = require('./mediator/command/get-cert-types.query');
const GetCertTypeByIdQuery = require('./mediator/command/get-cert-type-by-id.query');
const CreateCertTypeCommand = require('./mediator/command/create-cert-type.command');
const UpdateCertTypeCommand = require('./mediator/command/update-cert-type.command');
const DeleteCertTypeCommand = require('./mediator/command/delete-cert-type.command');

const GetCommentsQuery = require('./mediator/command/get-comments.query');
const PostCommentCommand = require('./mediator/command/post-comment.command');
const EditCommentCommand = require('./mediator/command/edit-comment.command');

const GetCompaniesQuery = require('./mediator/command/get-companies.query');
const GetCompanyByIdQuery = require('./mediator/command/get-company-by-id.query');
const GetMyCompanyQuery = require('./mediator/command/get-my-company.query');
const GetCompanyDetailQuery = require('./mediator/command/get-company-detail.query');
const CreateCompanyDetailCommand = require('./mediator/command/create-company-detail.command');

const GetDashboardMetricsQuery = require('./mediator/command/get-dashboard-metrics.query');
const GetCompanyMetricsQuery = require('./mediator/command/get-company-metrics.query');
const GetAdminMetricsQuery = require('./mediator/command/get-admin-metrics.query');

const GetLogsQuery = require('./mediator/command/get-logs.query');
const LogEventCommand = require('./mediator/command/log-event.command');

const GetSurveysQuery = require('./mediator/command/get-surveys.query');
const GetSurveyByIdQuery = require('./mediator/command/get-survey-by-id.query');
const SubmitAnswersCommand = require('./mediator/command/submit-answers.command');
const GetAnswersByApplicationQuery = require('./mediator/command/get-answers-by-application.query');

// Handlers
const LoginCommandHandler = require('./mediator/handler/login.handler');
const RegisterCommandHandler = require('./mediator/handler/register.handler');
const VerifyOtpCommandHandler = require('./mediator/handler/verify-otp.handler');
const ResendOtpCommandHandler = require('./mediator/handler/resend-otp.handler');
const RefreshCommandHandler = require('./mediator/handler/refresh.handler');
const LogoutCommandHandler = require('./mediator/handler/logout.handler');
const GetMeQueryHandler = require('./mediator/handler/get-me.handler');
const ChangePasswordCommandHandler = require('./mediator/handler/change-password.handler');
const GetUsersQueryHandler = require('./mediator/handler/get-users.handler');
const UpdateUserCommandHandler = require('./mediator/handler/update-user.handler');
const DeleteUserCommandHandler = require('./mediator/handler/delete-user.handler');

const SubmitApplicationCommandHandler = require('./mediator/handler/submit-application.handler');
const GetApplicationsQueryHandler = require('./mediator/handler/get-applications.handler');
const GetApplicationByIdQueryHandler = require('./mediator/handler/get-application-by-id.handler');
const AdminTakeActionCommandHandler = require('./mediator/handler/admin-take-action.handler');
const CompanyTakeActionCommandHandler = require('./mediator/handler/company-take-action.handler');
const UpdateApplicationStatusCommandHandler = require('./mediator/handler/update-application-status.handler');
const GetApplicationDocumentsQueryHandler = require('./mediator/handler/get-application-documents.handler');

const GetCertificatesQueryHandler = require('./mediator/handler/get-certificates.handler');
const GetCertificateByIdQueryHandler = require('./mediator/handler/get-certificate-by-id.handler');
const GetCertificateByApplicationIdQueryHandler = require('./mediator/handler/get-certificate-by-application-id.handler');
const PayCertificateCommandHandler = require('./mediator/handler/pay-certificate.handler');
const PayCertificateByApplicationCommandHandler = require('./mediator/handler/pay-certificate-by-application.handler');
const ViewCertificateHtmlQueryHandler = require('./mediator/handler/view-certificate-html.handler');
const SuspendCertificateCommandHandler = require('./mediator/handler/suspend-certificate.handler');

const GetCertTypesQueryHandler = require('./mediator/handler/get-cert-types.handler');
const GetCertTypeByIdQueryHandler = require('./mediator/handler/get-cert-type-by-id.handler');
const CreateCertTypeCommandHandler = require('./mediator/handler/create-cert-type.handler');
const UpdateCertTypeCommandHandler = require('./mediator/handler/update-cert-type.handler');
const DeleteCertTypeCommandHandler = require('./mediator/handler/delete-cert-type.handler');

const GetCommentsQueryHandler = require('./mediator/handler/get-comments.handler');
const PostCommentCommandHandler = require('./mediator/handler/post-comment.handler');
const EditCommentCommandHandler = require('./mediator/handler/edit-comment.handler');

const GetCompaniesQueryHandler = require('./mediator/handler/get-companies.handler');
const GetCompanyByIdQueryHandler = require('./mediator/handler/get-company-by-id.handler');
const GetMyCompanyQueryHandler = require('./mediator/handler/get-my-company.handler');
const GetCompanyDetailQueryHandler = require('./mediator/handler/get-company-detail.handler');
const CreateCompanyDetailCommandHandler = require('./mediator/handler/create-company-detail.handler');

const GetDashboardMetricsQueryHandler = require('./mediator/handler/get-dashboard-metrics.handler');
const GetCompanyMetricsQueryHandler = require('./mediator/handler/get-company-metrics.handler');
const GetAdminMetricsQueryHandler = require('./mediator/handler/get-admin-metrics.handler');

const GetLogsQueryHandler = require('./mediator/handler/get-logs.handler');
const LogEventCommandHandler = require('./mediator/handler/log-event.handler');

const GetSurveysQueryHandler = require('./mediator/handler/get-surveys.handler');
const GetSurveyByIdQueryHandler = require('./mediator/handler/get-survey-by-id.handler');
const SubmitAnswersCommandHandler = require('./mediator/handler/submit-answers.handler');
const GetAnswersByApplicationQueryHandler = require('./mediator/handler/get-answers-by-application.handler');

/**
 * Build and return the complete DI container.
 */
function buildContainer(fastify) {
  // 1. Repositories
  const authRepository = new AuthRepository(prisma);
  const dashboardRepository = new DashboardRepository(prisma);
  const applicationRepository = new ApplicationRepository(prisma);
  const commentRepository = new CommentRepository(prisma);
  const certificateRepository = new CertificateRepository(prisma);
  const logRepository = new LogRepository(prisma);
  const companyRepository = new CompanyRepository(prisma);
  const surveyRepository = new SurveyRepository(prisma);
  const certManagementRepository = new CertManagementRepository(prisma);

  // 2. Services
  const authService = new AuthService(authRepository, fastify, mailer);
  const dashboardService = new DashboardService(dashboardRepository);
  const applicationService = new ApplicationService(applicationRepository);
  const commentService = new CommentService(commentRepository, wsPool);
  const certificateService = new CertificateService(certificateRepository);
  const logService = new LogService(logRepository);
  const companyService = new CompanyService(companyRepository);
  const surveyService = new SurveyService(surveyRepository);
  const certManagementService = new CertManagementService(certManagementRepository);

  // 3. Mediator & Schemas
  const mediator = new Mediator();
  const schemaMap = new Map();
  schemaMap.set(LoginCommand.name, loginSchema);
  schemaMap.set(RegisterCommand.name, registerSchema);
  schemaMap.set(VerifyOtpCommand.name, verifyOtpSchema);
  schemaMap.set(ResendOtpCommand.name, resendOtpSchema);
  schemaMap.set(RefreshCommand.name, refreshSchema);
  schemaMap.set(ChangePasswordCommand.name, changePasswordSchema);
  schemaMap.set(GetUsersQuery.name, getUsersSchema);
  schemaMap.set(UpdateUserCommand.name, updateUserSchema);
  schemaMap.set(DeleteUserCommand.name, deleteUserSchema);

  schemaMap.set(SubmitApplicationCommand.name, submitApplicationSchema);
  schemaMap.set(GetApplicationsQuery.name, getApplicationsSchema);
  schemaMap.set(GetApplicationByIdQuery.name, getApplicationByIdSchema);
  schemaMap.set(AdminTakeActionCommand.name, adminTakeActionSchema);
  schemaMap.set(CompanyTakeActionCommand.name, companyTakeActionSchema);
  schemaMap.set(UpdateApplicationStatusCommand.name, updateApplicationStatusSchema);
  schemaMap.set(GetApplicationDocumentsQuery.name, getApplicationDocumentsSchema);

  schemaMap.set(GetCertificatesQuery.name, getCertificatesSchema);
  schemaMap.set(GetCertificateByIdQuery.name, getCertificateByIdSchema);
  schemaMap.set(GetCertificateByApplicationIdQuery.name, getCertificateByApplicationIdSchema);
  schemaMap.set(PayCertificateCommand.name, payCertificateSchema);
  schemaMap.set(PayCertificateByApplicationCommand.name, payCertificateByApplicationSchema);
  schemaMap.set(ViewCertificateHtmlQuery.name, viewCertificateHtmlSchema);
  schemaMap.set(SuspendCertificateCommand.name, suspendCertificateSchema);

  schemaMap.set(GetCertTypesQuery.name, getCertTypesSchema);
  schemaMap.set(GetCertTypeByIdQuery.name, getCertTypeByIdSchema);
  schemaMap.set(CreateCertTypeCommand.name, createCertTypeSchema);
  schemaMap.set(UpdateCertTypeCommand.name, updateCertTypeSchema);
  schemaMap.set(DeleteCertTypeCommand.name, deleteCertTypeSchema);

  schemaMap.set(GetCommentsQuery.name, getCommentsSchema);
  schemaMap.set(PostCommentCommand.name, postCommentSchema);
  schemaMap.set(EditCommentCommand.name, editCommentSchema);

  schemaMap.set(GetCompaniesQuery.name, getCompaniesSchema);
  schemaMap.set(GetCompanyByIdQuery.name, getCompanyByIdSchema);
  schemaMap.set(GetMyCompanyQuery.name, getMyCompanySchema);
  schemaMap.set(GetCompanyDetailQuery.name, getCompanyDetailSchema);
  schemaMap.set(CreateCompanyDetailCommand.name, createCompanyDetailSchema);

  schemaMap.set(GetDashboardMetricsQuery.name, getDashboardMetricsSchema);
  schemaMap.set(GetCompanyMetricsQuery.name, getCompanyMetricsSchema);
  schemaMap.set(GetAdminMetricsQuery.name, getAdminMetricsSchema);

  schemaMap.set(GetLogsQuery.name, getLogsSchema);
  schemaMap.set(LogEventCommand.name, logEventSchema);

  schemaMap.set(GetSurveysQuery.name, getSurveysSchema);
  schemaMap.set(GetSurveyByIdQuery.name, getSurveyByIdSchema);
  schemaMap.set(SubmitAnswersCommand.name, submitAnswersSchema);
  schemaMap.set(GetAnswersByApplicationQuery.name, getAnswersByApplicationSchema);
  
  mediator.use(createValidationBehavior(schemaMap));
  
  mediator.register(LoginCommand, new LoginCommandHandler(authService));
  mediator.register(RegisterCommand, new RegisterCommandHandler(authService));
  mediator.register(VerifyOtpCommand, new VerifyOtpCommandHandler(authService));
  mediator.register(ResendOtpCommand, new ResendOtpCommandHandler(authService));
  mediator.register(RefreshCommand, new RefreshCommandHandler(authService));
  mediator.register(LogoutCommand, new LogoutCommandHandler(authService));
  mediator.register(GetMeQuery, new GetMeQueryHandler(authService));
  mediator.register(ChangePasswordCommand, new ChangePasswordCommandHandler(authService));
  mediator.register(GetUsersQuery, new GetUsersQueryHandler(authService));
  mediator.register(UpdateUserCommand, new UpdateUserCommandHandler(authService));
  mediator.register(DeleteUserCommand, new DeleteUserCommandHandler(authService));

  mediator.register(SubmitApplicationCommand, new SubmitApplicationCommandHandler(applicationService));
  mediator.register(GetApplicationsQuery, new GetApplicationsQueryHandler(applicationService));
  mediator.register(GetApplicationByIdQuery, new GetApplicationByIdQueryHandler(applicationService));
  mediator.register(AdminTakeActionCommand, new AdminTakeActionCommandHandler(applicationService));
  mediator.register(CompanyTakeActionCommand, new CompanyTakeActionCommandHandler(applicationService));
  mediator.register(UpdateApplicationStatusCommand, new UpdateApplicationStatusCommandHandler(applicationService));
  mediator.register(GetApplicationDocumentsQuery, new GetApplicationDocumentsQueryHandler(applicationService));

  mediator.register(GetCertificatesQuery, new GetCertificatesQueryHandler(certificateService));
  mediator.register(GetCertificateByIdQuery, new GetCertificateByIdQueryHandler(certificateService));
  mediator.register(GetCertificateByApplicationIdQuery, new GetCertificateByApplicationIdQueryHandler(certificateService));
  mediator.register(PayCertificateCommand, new PayCertificateCommandHandler(certificateService));
  mediator.register(PayCertificateByApplicationCommand, new PayCertificateByApplicationCommandHandler(certificateService));
  mediator.register(ViewCertificateHtmlQuery, new ViewCertificateHtmlQueryHandler(certificateService));
  mediator.register(SuspendCertificateCommand, new SuspendCertificateCommandHandler(certificateService));

  mediator.register(GetCertTypesQuery, new GetCertTypesQueryHandler(certManagementService));
  mediator.register(GetCertTypeByIdQuery, new GetCertTypeByIdQueryHandler(certManagementService));
  mediator.register(CreateCertTypeCommand, new CreateCertTypeCommandHandler(certManagementService));
  mediator.register(UpdateCertTypeCommand, new UpdateCertTypeCommandHandler(certManagementService));
  mediator.register(DeleteCertTypeCommand, new DeleteCertTypeCommandHandler(certManagementService));

  mediator.register(GetCommentsQuery, new GetCommentsQueryHandler(commentService));
  mediator.register(PostCommentCommand, new PostCommentCommandHandler(commentService));
  mediator.register(EditCommentCommand, new EditCommentCommandHandler(commentService));

  mediator.register(GetCompaniesQuery, new GetCompaniesQueryHandler(companyService));
  mediator.register(GetCompanyByIdQuery, new GetCompanyByIdQueryHandler(companyService));
  mediator.register(GetMyCompanyQuery, new GetMyCompanyQueryHandler(companyService));
  mediator.register(GetCompanyDetailQuery, new GetCompanyDetailQueryHandler(companyService));
  mediator.register(CreateCompanyDetailCommand, new CreateCompanyDetailCommandHandler(companyService));

  mediator.register(GetDashboardMetricsQuery, new GetDashboardMetricsQueryHandler(dashboardService));
  mediator.register(GetCompanyMetricsQuery, new GetCompanyMetricsQueryHandler(dashboardService));
  mediator.register(GetAdminMetricsQuery, new GetAdminMetricsQueryHandler(dashboardService));

  mediator.register(GetLogsQuery, new GetLogsQueryHandler(logService));
  mediator.register(LogEventCommand, new LogEventCommandHandler(logService));

  mediator.register(GetSurveysQuery, new GetSurveysQueryHandler(surveyService));
  mediator.register(GetSurveyByIdQuery, new GetSurveyByIdQueryHandler(surveyService));
  mediator.register(SubmitAnswersCommand, new SubmitAnswersCommandHandler(surveyService));
  mediator.register(GetAnswersByApplicationQuery, new GetAnswersByApplicationQueryHandler(surveyService));

  // 4. Controllers
  const authController = new AuthController(mediator);
  const dashboardController = new DashboardController(mediator);
  const applicationController = new ApplicationController(mediator);
  const commentController = new CommentController(mediator, wsPool);
  const certificateController = new CertificateController(mediator);
  const logController = new LogController(mediator);
  const companyController = new CompanyController(mediator);
  const surveyController = new SurveyController(mediator);
  const certManagementController = new CertManagementController(mediator);

  return {
    mediator,
    authController,
    dashboardController,
    applicationController,
    commentController,
    certificateController,
    logController,
    companyController,
    surveyController,
    certManagementController,
  };
}

module.exports = buildContainer;
