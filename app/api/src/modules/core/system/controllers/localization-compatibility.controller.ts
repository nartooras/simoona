import { Controller, Get, Query } from "@nestjs/common";

@Controller("Localization")
export class LocalizationCompatibilityController {
  @Get("GetResource")
  getResource(@Query("key") key?: string) {
    return {
      status: "implemented",
      compatibility: "Localization/GetResource",
      key: key ?? "",
      value: ""
    };
  }

  @Get("GetResources")
  getResources() {
    return {
      status: "implemented",
      compatibility: "Localization/GetResources",
      resources: []
    };
  }
}
