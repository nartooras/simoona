import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { AdminReferenceCompatibilityService } from "../services/admin-reference-compatibility.service";

@Controller("Organization")
@UseGuards(LegacyPermissionGuard)
export class OrganizationCompatibilityController {
  constructor(private readonly adminService: AdminReferenceCompatibilityService) {}

  @Get("Get")
  get() {
    return this.adminService.getOrganization();
  }

  @Get("GetAll")
  getAll() {
    return this.adminService.getAllOrganizations();
  }

  @Post("Post")
  post(@Body() _payload: Record<string, unknown>) {
    return this.adminService.createOrganization();
  }

  @Put("Put")
  put(@Body() _payload: Record<string, unknown>) {
    return this.adminService.updateOrganization();
  }

  @Delete("Delete")
  delete(@Query("id") _id?: string) {
    return this.adminService.deleteOrganization();
  }

  @Get("GetManagingDirector")
  getManagingDirector(@Query("organizationId") _organizationId?: string) {
    return this.adminService.getManagingDirector();
  }

  @Post("SetManagingDirector")
  setManagingDirector(@Body() _payload: Record<string, unknown>) {
    return this.adminService.setManagingDirector();
  }
}
