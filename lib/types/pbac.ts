import { Feature, AccessLevel, MemberRole } from '@/lib/pbac';

export type { Feature, AccessLevel, MemberRole };

export interface PolicyConfig {
  feature: Feature;
  access: AccessLevel;
}

export interface UserPermissions {
  member: {
    id: string;
    userId: string;
    businessId: string;
    role: string;
    status: string;
  };
  permissions: Record<string, AccessLevel>;
}

export interface CreateMemberInput {
  userId: string;
  businessId: string;
  role: MemberRole;
  invitedBy?: string;
}

export interface UpdatePolicyInput {
  businessMemberId: string;
  feature: Feature;
  access: AccessLevel;
}
