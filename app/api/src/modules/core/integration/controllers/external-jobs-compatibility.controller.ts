import { Controller, Post, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { IntegrationCompatibilityService } from "../services/integration-compatibility.service";

@Controller("ExternalJobs")
@UseGuards(LegacyPermissionGuard)
export class ExternalJobsCompatibilityController {
  constructor(private readonly integrationService: IntegrationCompatibilityService) {}

  @Post("SendDailyMails")
  sendDailyMails() {
    return this.integrationService.sendDailyMails();
  }

  @Post("SendBirthdaysNotifications")
  sendBirthdaysNotifications() {
    return this.integrationService.sendBirthdaysNotifications();
  }

  @Post("AnonymizeUsers")
  anonymizeUsers() {
    return this.integrationService.anonymizeUsers();
  }

  @Post("ProcessExpiredBlacklistUsers")
  processExpiredBlacklistUsers() {
    return this.integrationService.processExpiredBlacklistUsers();
  }
}
