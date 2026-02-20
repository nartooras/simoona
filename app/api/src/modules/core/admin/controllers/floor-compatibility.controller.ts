import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { AdminReferenceCompatibilityService } from "../services/admin-reference-compatibility.service";

@Controller("Floor")
@UseGuards(LegacyPermissionGuard)
export class FloorCompatibilityController {
  constructor(private readonly adminService: AdminReferenceCompatibilityService) {}

  @Post("Post")
  post(@Body() _payload: Record<string, unknown>) {
    return this.adminService.createFloor();
  }

  @Put("Put")
  put(@Body() _payload: Record<string, unknown>) {
    return this.adminService.updateFloor();
  }

  @Get("GetByRoom")
  getByRoom(@Query("roomId") _roomId?: string) {
    return this.adminService.getFloorByRoom();
  }

  @Get("GetByOffice")
  getByOffice(@Query("officeId") _officeId?: string) {
    return this.adminService.getFloorsByOffice();
  }

  @Get("GetAllFloors")
  getAllFloors() {
    return this.adminService.getAllFloors();
  }

  @Get("GetPaged")
  getPaged() {
    return this.adminService.getPagedFloors();
  }

  @Delete("Delete")
  delete(@Query("id") _id?: string) {
    return this.adminService.deleteFloor();
  }
}
