import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthCompatibilityService } from "../services/auth-compatibility.service";
import { TokenRequest } from "@simoona/contracts/auth";

@Controller()
export class TokenCompatibilityController {
  constructor(private readonly authCompatibilityService: AuthCompatibilityService) {}

  @Post("token")
  @HttpCode(200)
  async issueToken(@Body() payload: TokenRequest) {
    return this.authCompatibilityService.issueToken(payload);
  }
}
