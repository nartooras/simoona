import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthCompatibilityService } from "../services/auth-compatibility.service";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import {
  RegisterExternalRequest,
  RegisterRequest,
  ResetPasswordRequest
} from "@simoona/contracts/auth";

@Controller("Account")
export class AccountCompatibilityController {
  constructor(private readonly authCompatibilityService: AuthCompatibilityService) {}

  @Get("UserInfo")
  @UseGuards(LegacyPermissionGuard)
  async getUserInfo(@Req() request: Request) {
    return this.authCompatibilityService.getUserInfo(request);
  }

  @Post("Register")
  async register(@Body() payload: RegisterRequest) {
    return this.authCompatibilityService.register(payload);
  }

  @Post("RegisterExternal")
  @UseGuards(LegacyPermissionGuard)
  async registerExternal(@Body() payload: RegisterExternalRequest, @Req() request: Request) {
    return this.authCompatibilityService.registerExternal(payload, request);
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
  @UseGuards(LegacyPermissionGuard)
  async logout(@Req() request: Request) {
    return this.authCompatibilityService.logout(request);
  }
}
