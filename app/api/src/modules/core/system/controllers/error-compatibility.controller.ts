import { All, Controller, HttpCode } from "@nestjs/common";

@Controller("Error")
export class ErrorCompatibilityController {
  @All("NotFound")
  @HttpCode(404)
  notFound() {
    return {
      status: "implemented",
      compatibility: "Error/NotFound",
      errorCode: "LEGACY_NOT_FOUND",
      errorMessage: "The requested resource was not found"
    };
  }
}
