import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { AdminReferenceCompatibilityService } from "../services/admin-reference-compatibility.service";

@Controller("Office")
@UseGuards(LegacyPermissionGuard)
export class OfficeCompatibilityController {
  constructor(private readonly adminService: AdminReferenceCompatibilityService) {}

  @Get("GetAll")
  getAll() {
    return this.adminService.getAllOffices();
  }

  @Get("GetDefault")
  getDefault() {
    return this.adminService.getDefaultOffice();
  }

  @Get("GetAllOfficesForDropdown")
  getAllForDropdown() {
    return this.adminService.getOfficesForDropdown();
  }

  @Post("Post")
  post(@Body() _payload: Record<string, unknown>) {
    return this.adminService.createOffice();
  }

  @Put("Put")
  put(@Body() _payload: Record<string, unknown>) {
    return this.adminService.updateOffice();
  }

  @Delete("Delete")
  delete(@Query("id") _id?: string) {
    return this.adminService.deleteOffice();
  }
}
