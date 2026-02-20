import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "../services/social-compatibility.service";

@Controller("Wall")
@UseGuards(LegacyPermissionGuard)
export class WallCompatibilityController {
  constructor(private readonly socialCompatibilityService: SocialCompatibilityService) {}

  @Post("Create")
  async createWall(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.createWall();
  }

  @Put("Edit")
  async editWall(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.editWall();
  }

  @Delete("Delete")
  async deleteWall(@Query("id") _wallId?: string) {
    return this.socialCompatibilityService.deleteWall();
  }

  @Get("List")
  async getWallList() {
    return this.socialCompatibilityService.getWallList();
  }

  @Get("Details")
  async getWallDetails(@Query("id") _wallId?: string) {
    return this.socialCompatibilityService.getWallDetails();
  }

  @Get("Posts")
  async getWallPosts(@Query("wallId") _wallId?: string) {
    return this.socialCompatibilityService.getWallPosts();
  }

  @Get("AllPosts")
  async getAllWallPosts(@Query("wallId") _wallId?: string) {
    return this.socialCompatibilityService.getAllWallPosts();
  }

  @Get("Members")
  async getWallMembers(@Query("wallId") _wallId?: string) {
    return this.socialCompatibilityService.getWallMembers();
  }

  @Put("Follow")
  async followWall(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.followWall();
  }

  @Get("Search")
  async searchWall(@Query("query") _query?: string) {
    return this.socialCompatibilityService.searchWall();
  }
}
