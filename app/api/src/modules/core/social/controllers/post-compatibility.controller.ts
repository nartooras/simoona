import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "../services/social-compatibility.service";

@Controller("Post")
@UseGuards(LegacyPermissionGuard)
export class PostCompatibilityController {
  constructor(private readonly socialCompatibilityService: SocialCompatibilityService) {}

  @Post("Create")
  async createPost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.createPost();
  }

  @Put("Edit")
  async editPost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.editPost();
  }

  @Delete("Delete")
  async deletePost(@Query("id") _postId?: string) {
    return this.socialCompatibilityService.deletePost();
  }

  @Get("GetPost")
  async getPost(@Query("id") _postId?: string) {
    return this.socialCompatibilityService.getPost();
  }

  @Put("Hide")
  async hidePost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.hidePost();
  }

  @Put("Like")
  async likePost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.likePost();
  }

  @Put("Watch")
  async watchPost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.watchPost();
  }

  @Put("Unwatch")
  async unwatchPost(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.unwatchPost();
  }
}
