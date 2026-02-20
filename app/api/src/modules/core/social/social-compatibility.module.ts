import { Module } from "@nestjs/common";
import { LegacyPermissionGuard } from "../permissions/legacy-permission.guard";
import { SocialCompatibilityService } from "./services/social-compatibility.service";
import { WallCompatibilityController } from "./controllers/wall-compatibility.controller";
import { PostCompatibilityController } from "./controllers/post-compatibility.controller";
import { CommentCompatibilityController } from "./controllers/comment-compatibility.controller";
import { NotificationCompatibilityController } from "./controllers/notification-compatibility.controller";
import { UserNotificationCompatibilityController } from "./controllers/user-notification-compatibility.controller";
import { PlannedWallReadAdapter } from "./adapters/wall-read.adapter";
import { PlannedSocialOperationAdapter } from "./adapters/social-operation.adapter";

@Module({
  controllers: [
    WallCompatibilityController,
    PostCompatibilityController,
    CommentCompatibilityController,
    NotificationCompatibilityController,
    UserNotificationCompatibilityController
  ],
  providers: [
    SocialCompatibilityService,
    LegacyPermissionGuard,
    PlannedWallReadAdapter,
    PlannedSocialOperationAdapter
  ]
})
export class SocialCompatibilityModule {}
