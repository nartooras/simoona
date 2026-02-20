import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "../services/social-compatibility.service";

@Controller("User")
@UseGuards(LegacyPermissionGuard)
export class UserNotificationCompatibilityController {
  constructor(private readonly socialCompatibilityService: SocialCompatibilityService) {}

  @Get("Notifications")
  async getNotifications() {
    return this.socialCompatibilityService.getUserNotificationSettings();
  }

  @Put("Notifications")
  async updateNotifications(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.updateUserNotificationSettings();
  }
}
