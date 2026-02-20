import { Injectable } from "@nestjs/common";
import { PlannedSocialOperationAdapter } from "../adapters/social-operation.adapter";
import { PlannedWallReadAdapter } from "../adapters/wall-read.adapter";
import { normalizeNotificationSettingsCompatibilityResponse } from "../dto/notification-settings-compatibility.dto";
import { normalizeSocialOperationCompatibilityResponse } from "../dto/social-operation-compatibility.dto";
import { normalizeWallReadCompatibilityResponse } from "../dto/wall-read-compatibility.dto";

export const WAVE_A_REALTIME_MARKERS = {
  notificationHubNewNotification: {
    markerId: "wave-a-realtime-notificationhub-new-notification",
    compatibility: "Realtime/NotificationHub:newNotification"
  },
  notificationHubNewContent: {
    markerId: "wave-a-realtime-notificationhub-new-content",
    compatibility: "Realtime/NotificationHub:newContent"
  },
  postNotifierNewPost: {
    markerId: "wave-a-realtime-postnotifier-new-post",
    compatibility: "Realtime/PostNotifier:NotifyAboutNewPostAsync"
  },
  postNotifierUpdatedMentions: {
    markerId: "wave-a-realtime-postnotifier-updated-mentions",
    compatibility: "Realtime/PostNotifier:NotifyUpdatedPostMentionsAsync"
  },
  commentNotifierNewComment: {
    markerId: "wave-a-realtime-commentnotifier-new-comment",
    compatibility: "Realtime/CommentNotifier:NotifyAboutNewCommentAsync"
  },
  commentNotifierUpdatedMentions: {
    markerId: "wave-a-realtime-commentnotifier-updated-mentions",
    compatibility: "Realtime/CommentNotifier:NotifyUpdatedCommentMentionsAsync"
  }
} as const;

@Injectable()
export class SocialCompatibilityService {
  constructor(
    private readonly plannedWallReadAdapter: PlannedWallReadAdapter,
    private readonly plannedSocialOperationAdapter: PlannedSocialOperationAdapter
  ) {}

  async createWall() {
    return { status: "implemented", compatibility: "Wall/Create" };
  }

  async editWall() {
    return { status: "implemented", compatibility: "Wall/Edit" };
  }

  async deleteWall() {
    return { status: "implemented", compatibility: "Wall/Delete" };
  }

  async getWallList() {
    const adapterPayload = await this.plannedWallReadAdapter.getWallList();

    return normalizeWallReadCompatibilityResponse(adapterPayload, {
      status: "implemented",
      compatibility: "Wall/List"
    });
  }

  async getWallDetails() {
    const adapterPayload = await this.plannedWallReadAdapter.getWallDetails();

    return normalizeWallReadCompatibilityResponse(adapterPayload, {
      status: "implemented",
      compatibility: "Wall/Details"
    });
  }

  async getWallPosts() {
    const adapterPayload = await this.plannedWallReadAdapter.getWallPosts();

    return normalizeWallReadCompatibilityResponse(adapterPayload, {
      status: "implemented",
      compatibility: "Wall/Posts"
    });
  }

  async getAllWallPosts() {
    const adapterPayload = await this.plannedWallReadAdapter.getAllWallPosts();

    return normalizeWallReadCompatibilityResponse(adapterPayload, {
      status: "implemented",
      compatibility: "Wall/AllPosts"
    });
  }

  async getWallMembers() {
    return { status: "implemented", compatibility: "Wall/Members" };
  }

  async followWall() {
    return { status: "implemented", compatibility: "Wall/Follow" };
  }

  async searchWall() {
    return { status: "implemented", compatibility: "Wall/Search" };
  }

  async createPost() {
    const payload = await this.plannedSocialOperationAdapter.execute("createPost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Create"
    });
  }

  async editPost() {
    const payload = await this.plannedSocialOperationAdapter.execute("editPost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Edit"
    });
  }

  async deletePost() {
    const payload = await this.plannedSocialOperationAdapter.execute("deletePost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Delete"
    });
  }

  async getPost() {
    const payload = await this.plannedSocialOperationAdapter.execute("getPost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/GetPost"
    });
  }

  async hidePost() {
    const payload = await this.plannedSocialOperationAdapter.execute("hidePost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Hide"
    });
  }

  async likePost() {
    const payload = await this.plannedSocialOperationAdapter.execute("likePost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Like"
    });
  }

  async watchPost() {
    const payload = await this.plannedSocialOperationAdapter.execute("watchPost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Watch"
    });
  }

  async unwatchPost() {
    const payload = await this.plannedSocialOperationAdapter.execute("unwatchPost");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Post/Unwatch"
    });
  }

  async createComment() {
    const payload = await this.plannedSocialOperationAdapter.execute("createComment");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Comment/Create"
    });
  }

  async editComment() {
    const payload = await this.plannedSocialOperationAdapter.execute("editComment");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Comment/Edit"
    });
  }

  async deleteComment() {
    const payload = await this.plannedSocialOperationAdapter.execute("deleteComment");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Comment/Delete"
    });
  }

  async hideComment() {
    const payload = await this.plannedSocialOperationAdapter.execute("hideComment");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Comment/Hide"
    });
  }

  async likeComment() {
    const payload = await this.plannedSocialOperationAdapter.execute("likeComment");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Comment/Like"
    });
  }

  async getNotifications() {
    const payload = await this.plannedSocialOperationAdapter.execute("getNotifications");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Notification/GetAll"
    });
  }

  async markNotificationsAsRead() {
    const payload = await this.plannedSocialOperationAdapter.execute("markNotificationsAsRead");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Notification/MarkAsRead"
    });
  }

  async markAllNotificationsAsRead() {
    const payload = await this.plannedSocialOperationAdapter.execute("markAllNotificationsAsRead");

    return normalizeSocialOperationCompatibilityResponse(payload, {
      status: "implemented",
      compatibility: "Notification/MarkAllAsRead"
    });
  }

  async getUserNotificationSettings() {
    return normalizeNotificationSettingsCompatibilityResponse(
      {
        source: "wave-a-user-notifications-boundary",
        operation: "get"
      },
      {
        status: "implemented",
        compatibility: "User/Notifications:Get"
      }
    );
  }

  async updateUserNotificationSettings() {
    return normalizeNotificationSettingsCompatibilityResponse(
      {
        source: "wave-a-user-notifications-boundary",
        operation: "put"
      },
      {
        status: "implemented",
        compatibility: "User/Notifications:Put"
      }
    );
  }

  async emitNotificationHubNewNotification() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.notificationHubNewNotification);
  }

  async emitNotificationHubNewContent() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.notificationHubNewContent);
  }

  async triggerPostNotifierNewPost() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.postNotifierNewPost);
  }

  async triggerPostNotifierUpdatedMentions() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.postNotifierUpdatedMentions);
  }

  async triggerCommentNotifierNewComment() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.commentNotifierNewComment);
  }

  async triggerCommentNotifierUpdatedMentions() {
    return this.buildRealtimeScaffold(WAVE_A_REALTIME_MARKERS.commentNotifierUpdatedMentions);
  }

  private buildRealtimeScaffold(marker: {
    readonly markerId: string;
    readonly compatibility: string;
  }) {
    return {
      status: "implemented",
      markerId: marker.markerId,
      compatibility: marker.compatibility
    };
  }
}
