import { Injectable } from "@nestjs/common";

export interface WallReadAdapterPayload {
  source: string;
  adapter: string;
  operation: string;
  payloadVersion: string;
}

@Injectable()
export class PlannedWallReadAdapter {
  async getWallList(): Promise<WallReadAdapterPayload> {
    return this.buildPayload("getWallList");
  }

  async getWallDetails(): Promise<WallReadAdapterPayload> {
    return this.buildPayload("getWallDetails");
  }

  async getWallPosts(): Promise<WallReadAdapterPayload> {
    return this.buildPayload("getWallPosts");
  }

  async getAllWallPosts(): Promise<WallReadAdapterPayload> {
    return this.buildPayload("getAllWallPosts");
  }

  private buildPayload(operation: string): WallReadAdapterPayload {
    return {
      source: "wave-a-wall-read-adapter",
      adapter: "PlannedWallReadAdapter",
      operation,
      payloadVersion: "v1"
    };
  }
}
