// src/repositories/survey.repository.js

class SurveyRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // ─── Survey ────────────────────────────

  async findAllSurveys() {
    return this.prisma.survey.findMany({
      include: {
        sections: {
          include: { questions: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async findSurveyById(id) {
    return this.prisma.survey.findUnique({
      where: { id: BigInt(id) },
      include: {
        sections: {
          include: { questions: { orderBy: { id: 'asc' } } },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  // ─── Answers ───────────────────────────

  async submitAnswers(answers) {
    // Bulk create answers
    return this.prisma.answer.createMany({ data: answers });
  }

  async findAnswersByApplication(applicationId) {
    return this.prisma.answer.findMany({
      where: { application_id: applicationId },
      include: { question: true },
      orderBy: { id: 'asc' },
    });
  }

  async findAnswersByCompany(companyId) {
    return this.prisma.answer.findMany({
      where: { company_id: companyId },
      include: { question: true },
    });
  }
}

module.exports = SurveyRepository;
