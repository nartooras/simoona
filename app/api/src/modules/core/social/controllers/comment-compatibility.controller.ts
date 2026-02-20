import { Body, Controller, Delete, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "../services/social-compatibility.service";

@Controller("Comment")
@UseGuards(LegacyPermissionGuard)
export class CommentCompatibilityController {
  constructor(private readonly socialCompatibilityService: SocialCompatibilityService) {}

  @Post("Create")
  async createComment(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.createComment();
  }

  @Put("Edit")
  async editComment(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.editComment();
  }

  @Delete("Delete")
  async deleteComment(@Query("id") _commentId?: string) {
    return this.socialCompatibilityService.deleteComment();
  }

  @Put("Hide")
  async hideComment(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.hideComment();
  }

  @Put("Like")
  async likeComment(@Body() _payload: Record<string, unknown>) {
    return this.socialCompatibilityService.likeComment();
  }
}
