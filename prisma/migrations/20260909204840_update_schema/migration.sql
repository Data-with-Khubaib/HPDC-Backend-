-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'COMPANY', 'CONSULTANT');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" BIGINT NOT NULL,
    "role" "user_role" NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "phone_number" BIGINT NOT NULL,
    "country" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "registration_number" BIGINT NOT NULL,
    "contact_person" TEXT NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" UUID NOT NULL,
    "TotalApplication" INTEGER NOT NULL,
    "RejectedApplication" INTEGER NOT NULL,
    "ActiveCetificates" INTEGER NOT NULL,
    "SuspendCertificates" INTEGER NOT NULL,
    "WithdrawnCertificates" INTEGER NOT NULL,
    "ExpiredCertificates" INTEGER NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" UUID NOT NULL,
    "application_no" UUID NOT NULL,
    "receiver_id" BIGINT NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "company_id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "certificate_type" VARCHAR(255) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" BIGINT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application_Documents" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" DATE NOT NULL,

    CONSTRAINT "Application_Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application_Conditions" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_Conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "certificate_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issued" DATE NOT NULL,
    "expiry" DATE NOT NULL,
    "sites" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" BIGSERIAL NOT NULL,
    "survey_id" BIGINT NOT NULL,
    "section_name" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" BIGSERIAL NOT NULL,
    "survey_id" BIGINT NOT NULL,
    "section_id" BIGINT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" VARCHAR(50) NOT NULL,
    "is_required" BOOLEAN NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" BIGSERIAL NOT NULL,
    "application_id" UUID NOT NULL,
    "question_id" BIGINT NOT NULL,
    "survey_answers" TEXT NOT NULL,
    "partial_text" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company_detail" (
    "registration_no" BIGINT NOT NULL,
    "application_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "tax_registration_no" BIGINT NOT NULL,
    "buisness_type" VARCHAR(255) NOT NULL,
    "sector" VARCHAR(255) NOT NULL,
    "contact_no" BIGINT NOT NULL,
    "scope" VARCHAR(255) NOT NULL,
    "multiple_sites" BOOLEAN NOT NULL,
    "site_details" JSONB NOT NULL,
    "employees" JSONB NOT NULL,
    "certifications" JSONB NOT NULL,
    "additional_notes" TEXT NOT NULL,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "Company_detail_pkey" PRIMARY KEY ("registration_no")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "activities" VARCHAR(255) NOT NULL,
    "products" VARCHAR(255) NOT NULL,
    "critical_process" BOOLEAN NOT NULL,
    "outsourced_processed" BOOLEAN NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sub_Brand" (
    "id" BIGSERIAL NOT NULL,
    "brand_id" BIGINT NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "brand_skus" INTEGER NOT NULL,

    CONSTRAINT "Sub_Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comapny_Address" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "headoffice_address" TEXT NOT NULL,
    "national_address" TEXT,
    "detailed_address" TEXT NOT NULL,

    CONSTRAINT "Comapny_Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ESG_Details" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "program_in_place" BOOLEAN NOT NULL,
    "has_esh_policy" BOOLEAN NOT NULL,
    "has_sustainability_report" BOOLEAN NOT NULL,
    "has_ghg_monitoring" BOOLEAN NOT NULL,
    "has_energy_management" BOOLEAN NOT NULL,
    "has_social_responsibility" BOOLEAN NOT NULL,
    "has_grc_framework" BOOLEAN NOT NULL,

    CONSTRAINT "ESG_Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate_Management" (
    "id" UUID NOT NULL,
    "certificate_name" VARCHAR(255),
    "certificate_type" VARCHAR(255),
    "duration" INTEGER NOT NULL,
    "application_fee" BIGINT NOT NULL,
    "certificate_fee" BIGINT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Certificate_Management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "All_Activity_Log" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "user_name" TEXT NOT NULL,
    "action_text" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "All_Activity_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity_Timeline" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "action_text" TEXT NOT NULL,
    "created_at" DATE NOT NULL,

    CONSTRAINT "Activity_Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_comments" (
    "id" BIGSERIAL NOT NULL,
    "application_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "comment_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "otp_code" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_user_id_key" ON "Companies"("user_id");

-- CreateIndex
CREATE INDEX "Companies_id_idx" ON "Companies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Application_receiver_id_key" ON "Application"("receiver_id");

-- CreateIndex
CREATE INDEX "Application_id_idx" ON "Application"("id");

-- CreateIndex
CREATE INDEX "Certificates_id_idx" ON "Certificates"("id");

-- CreateIndex
CREATE INDEX "Survey_id_idx" ON "Survey"("id");

-- CreateIndex
CREATE INDEX "Questions_id_idx" ON "Questions"("id");

-- CreateIndex
CREATE INDEX "otp_codes_user_id_idx" ON "otp_codes"("user_id");

-- CreateIndex
CREATE INDEX "otp_codes_otp_code_idx" ON "otp_codes"("otp_code");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_id_fkey" FOREIGN KEY ("id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Documents" ADD CONSTRAINT "Application_Documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Conditions" ADD CONSTRAINT "Application_Conditions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company_detail" ADD CONSTRAINT "Company_detail_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company_detail"("registration_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_Brand" ADD CONSTRAINT "Sub_Brand_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comapny_Address" ADD CONSTRAINT "Comapny_Address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company_detail"("registration_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESG_Details" ADD CONSTRAINT "ESG_Details_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company_detail"("registration_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "All_Activity_Log" ADD CONSTRAINT "All_Activity_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "All_Activity_Log" ADD CONSTRAINT "All_Activity_Log_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity_Timeline" ADD CONSTRAINT "Activity_Timeline_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_comments" ADD CONSTRAINT "application_comments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_comments" ADD CONSTRAINT "application_comments_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
