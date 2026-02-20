import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "../services/social-compatibility.service";

@Controller("Notification")
@UseGuards(LegacyPermissionGuard)
export class NotificationCompatibilityController {
  constructor(private readonly socialCompatibilityService: SocialCompatibilityService) {}

  @Get("GetAll")
  async getAll() {
    return this.socialCompatibilityService.getNotifications();
  }

  @Put("MarkAsRead")
  async markAsRead(@Body() _payload: unknown) {
    return this.socialCompatibilityService.markNotificationsAsRead();
  }

  @Put("MarkAllAsRead")
  async markAllAsRead(@Body() _payload: unknown) {
    return this.socialCompatibilityService.markAllNotificationsAsRead();
  }
}
