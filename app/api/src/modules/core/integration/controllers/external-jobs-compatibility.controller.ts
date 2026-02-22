import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { IntegrationCompatibilityService } from "../services/integration-compatibility.service";

@Controller("ExternalJobs")
@UseGuards(LegacyPermissionGuard)
export class ExternalJobsCompatibilityController {
  constructor(private readonly integrationService: IntegrationCompatibilityService) {}

  @Post("SendDailyMails")
  sendDailyMails(@Req() request: Request) {
    return this.integrationService.sendDailyMails(request);
  }

  @Post("SendBirthdaysNotifications")
  sendBirthdaysNotifications(@Req() request: Request) {
    return this.integrationService.sendBirthdaysNotifications(request);
  }

  @Post("AnonymizeUsers")
  anonymizeUsers(@Req() request: Request) {
    return this.integrationService.anonymizeUsers(request);
  }

  @Post("ProcessExpiredBlacklistUsers")
  processExpiredBlacklistUsers(@Req() request: Request) {
    return this.integrationService.processExpiredBlacklistUsers(request);
  }
}
