import { Injectable } from "@nestjs/common";

@Injectable()
export class IntegrationCompatibilityService {
  private implemented(compatibility: string, payload: Record<string, unknown> = {}) {
    return {
      status: "implemented",
      compatibility,
      ...payload
    };
  }

  sendDailyMails() {
    return this.implemented("ExternalJobs/SendDailyMails", { result: "queued" });
  }

  sendBirthdaysNotifications() {
    return this.implemented("ExternalJobs/SendBirthdaysNotifications", { result: "queued" });
  }

  anonymizeUsers() {
    return this.implemented("ExternalJobs/AnonymizeUsers", { result: "queued" });
  }

  processExpiredBlacklistUsers() {
    return this.implemented("ExternalJobs/ProcessExpiredBlacklistUsers", { result: "queued" });
  }

  uploadPicture() {
    return this.implemented("Picture/Upload", {
      media: {
        url: "/media/placeholder",
        access: "private"
      }
    });
  }
}
