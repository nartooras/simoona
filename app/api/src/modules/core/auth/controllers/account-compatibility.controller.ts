import { Body, Controller, Delete, Get, HttpCode, Post } from "@nestjs/common";
import { AuthCompatibilityService } from "../services/auth-compatibility.service";
import {
  RegisterExternalRequest,
  RegisterRequest,
  ResetPasswordRequest
} from "@simoona/contracts/auth";

@Controller("Account")
export class AccountCompatibilityController {
  constructor(private readonly authCompatibilityService: AuthCompatibilityService) {}

  @Get("UserInfo")
  async getUserInfo() {
    return this.authCompatibilityService.getUserInfo();
  }

  @Post("Register")
  async register(@Body() payload: RegisterRequest) {
    return this.authCompatibilityService.register(payload);
  }

  @Post("RegisterExternal")
  async registerExternal(@Body() payload: RegisterExternalRequest) {
    return this.authCompatibilityService.registerExternal(payload);
  }

  @Post("RequestPasswordReset")
  @HttpCode(200)
  async requestPasswordReset(@Body() payload: { email: string }) {
    return this.authCompatibilityService.requestPasswordReset(payload);
  }

  @Post("ResetPassword")
  async resetPassword(@Body() payload: ResetPasswordRequest) {
    return this.authCompatibilityService.resetPassword(payload);
  }

  @Post("VerifyEmail")
  async verifyEmail(@Body() payload: { token: string }) {
    return this.authCompatibilityService.verifyEmail(payload);
  }

  @Get("ExternalLogins")
  async externalLogins() {
    return this.authCompatibilityService.externalLogins();
  }

  @Get("InternalLogins")
  async internalLogins() {
    return this.authCompatibilityService.internalLogins();
  }

  @Get("ExternalLogin")
  async externalLogin() {
    return this.authCompatibilityService.externalLogin();
  }

  @Delete("Logout")
  @HttpCode(200)
  async logout() {
    return this.authCompatibilityService.logout();
  }
}
