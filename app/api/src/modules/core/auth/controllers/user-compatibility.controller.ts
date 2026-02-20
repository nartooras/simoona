import { Body, Controller, Delete, Get, Put, Query } from "@nestjs/common";
import { AuthCompatibilityService } from "../services/auth-compatibility.service";

@Controller("User")
export class UserCompatibilityController {
  constructor(private readonly authCompatibilityService: AuthCompatibilityService) {}

  @Get("GeneralSettings")
  async getLocalizationSettings() {
    return this.authCompatibilityService.getLocalizationSettings();
  }

  @Put("GeneralSettings")
  async changeLocalizationSettings(@Body() _payload: Record<string, unknown>) {
    return this.authCompatibilityService.changeLocalizationSettings();
  }

  @Get("Logins")
  async getUserLogins() {
    return this.authCompatibilityService.getUserLogins();
  }

  @Delete("DeleteLogin")
  async unlinkLogin(@Query("provider") _provider?: string) {
    return this.authCompatibilityService.unlinkLogin();
  }

  @Get("GetUsersForAutocomplete")
  async getUsersForAutocomplete(@Query("query") _query?: string) {
    return this.authCompatibilityService.getUsersForAutocomplete();
  }
}
