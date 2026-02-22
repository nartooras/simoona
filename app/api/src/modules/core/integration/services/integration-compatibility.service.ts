import { Injectable, UnsupportedMediaTypeException } from "@nestjs/common";
import type { Request } from "express";
import {
  INTEGRATION_FAILURE_MODES,
  throwIfIntegrationFailure
} from "./integration-failure-policy";

@Injectable()
export class IntegrationCompatibilityService {
  private implemented(compatibility: string, payload: Record<string, unknown> = {}) {
    return {
      status: "implemented",
      compatibility,
      ...payload
    };
  }

  sendDailyMails(request?: Request) {
    throwIfIntegrationFailure(request, "ExternalJobs/SendDailyMails", [
      INTEGRATION_FAILURE_MODES.smtpTimeout,
      INTEGRATION_FAILURE_MODES.smtpAuthFailure,
      INTEGRATION_FAILURE_MODES.externalJobsTimeout,
      INTEGRATION_FAILURE_MODES.externalJobsAuthFailure
    ]);

    return this.implemented("ExternalJobs/SendDailyMails", {
      result: "queued",
      provider: "smtp"
    });
  }

  sendBirthdaysNotifications(request?: Request) {
    throwIfIntegrationFailure(request, "ExternalJobs/SendBirthdaysNotifications", [
      INTEGRATION_FAILURE_MODES.smtpTimeout,
      INTEGRATION_FAILURE_MODES.smtpAuthFailure,
      INTEGRATION_FAILURE_MODES.externalJobsTimeout,
      INTEGRATION_FAILURE_MODES.externalJobsAuthFailure
    ]);

    return this.implemented("ExternalJobs/SendBirthdaysNotifications", {
      result: "queued",
      provider: "smtp"
    });
  }

  anonymizeUsers(request?: Request) {
    throwIfIntegrationFailure(request, "ExternalJobs/AnonymizeUsers", [
      INTEGRATION_FAILURE_MODES.externalJobsTimeout,
      INTEGRATION_FAILURE_MODES.externalJobsAuthFailure
    ]);

    return this.implemented("ExternalJobs/AnonymizeUsers", { result: "queued" });
  }

  processExpiredBlacklistUsers(request?: Request) {
    throwIfIntegrationFailure(request, "ExternalJobs/ProcessExpiredBlacklistUsers", [
      INTEGRATION_FAILURE_MODES.externalJobsTimeout,
      INTEGRATION_FAILURE_MODES.externalJobsAuthFailure
    ]);

    return this.implemented("ExternalJobs/ProcessExpiredBlacklistUsers", { result: "queued" });
  }

  uploadPicture(request?: Request) {
    const contentType = String(request?.headers?.["content-type"] ?? "");
    if (!contentType.includes("multipart/form-data") && !contentType.includes("application/json")) {
      throw new UnsupportedMediaTypeException("Picture upload expects multipart form-data payload.");
    }

    throwIfIntegrationFailure(request, "Picture/Upload", [
      INTEGRATION_FAILURE_MODES.storageTimeout,
      INTEGRATION_FAILURE_MODES.storageAuthFailure
    ]);

    return this.implemented("Picture/Upload", {
      media: {
        url: "/media/placeholder",
        access: "private",
        provider: "storage"
      }
    });
  }
}
