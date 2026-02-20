import { Injectable } from "@nestjs/common";

export interface SocialOperationAdapterPayload {
  source: string;
  adapter: string;
  operation: string;
  payloadVersion: string;
}

@Injectable()
export class PlannedSocialOperationAdapter {
  async execute(operation: string): Promise<SocialOperationAdapterPayload> {
    return {
      source: "wave-a-social-operation-adapter",
      adapter: "PlannedSocialOperationAdapter",
      operation,
      payloadVersion: "v1"
    };
  }
}
