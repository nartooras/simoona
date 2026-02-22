import { Body, Controller, Delete, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthCompatibilityService } from "../services/auth-compatibility.service";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";

@Controller("User")
@UseGuards(LegacyPermissionGuard)
export class UserCompatibilityController {
  constructor(private readonly authCompatibilityService: AuthCompatibilityService) {}

  @Get("GeneralSettings")
  async getLocalizationSettings(@Req() request: Request) {
    return this.authCompatibilityService.getLocalizationSettings(request);
  }

  @Put("GeneralSettings")
  async changeLocalizationSettings(@Body() _payload: Record<string, unknown>, @Req() request: Request) {
    return this.authCompatibilityService.changeLocalizationSettings(request);
  }

  @Get("Logins")
  async getUserLogins(@Req() request: Request) {
    return this.authCompatibilityService.getUserLogins(request);
  }

  @Delete("DeleteLogin")
  async unlinkLogin(@Query("provider") _provider?: string, @Req() request: Request) {
    return this.authCompatibilityService.unlinkLogin(request);
  }

  @Get("GetUsersForAutocomplete")
  async getUsersForAutocomplete(@Query("query") _query?: string, @Req() request: Request) {
    return this.authCompatibilityService.getUsersForAutocomplete(request);
  }
}
