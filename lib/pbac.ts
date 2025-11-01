import { prisma } from '@/lib/prisma';

// Feature types yang bisa dikontrol
export enum Feature {
  BOOKINGS = 'bookings',
  SERVICES = 'services',
  SETTINGS = 'settings',
  MEMBERS = 'members',
  PAYMENTS = 'payments',
  ANALYTICS = 'analytics',
}

// Access levels
export enum AccessLevel {
  DISABLED = 'disabled',
  READ = 'read',
  WRITE = 'write',
}

// Role types (for display only, actual permissions dari policies)
export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  STAFF = 'staff',
  MEMBER = 'member',
}

// Default policies untuk owner (full access)
export const OWNER_DEFAULT_POLICIES = [
  { feature: Feature.BOOKINGS, access: AccessLevel.WRITE },
  { feature: Feature.SERVICES, access: AccessLevel.WRITE },
  { feature: Feature.SETTINGS, access: AccessLevel.WRITE },
  { feature: Feature.MEMBERS, access: AccessLevel.WRITE },
  { feature: Feature.PAYMENTS, access: AccessLevel.WRITE },
  { feature: Feature.ANALYTICS, access: AccessLevel.WRITE },
];

// Default policies untuk admin
export const ADMIN_DEFAULT_POLICIES = [
  { feature: Feature.BOOKINGS, access: AccessLevel.WRITE },
  { feature: Feature.SERVICES, access: AccessLevel.WRITE },
  { feature: Feature.SETTINGS, access: AccessLevel.READ },
  { feature: Feature.MEMBERS, access: AccessLevel.READ },
  { feature: Feature.PAYMENTS, access: AccessLevel.WRITE },
  { feature: Feature.ANALYTICS, access: AccessLevel.READ },
];

// Default policies untuk staff
export const STAFF_DEFAULT_POLICIES = [
  { feature: Feature.BOOKINGS, access: AccessLevel.WRITE },
  { feature: Feature.SERVICES, access: AccessLevel.READ },
  { feature: Feature.SETTINGS, access: AccessLevel.DISABLED },
  { feature: Feature.MEMBERS, access: AccessLevel.DISABLED },
  { feature: Feature.PAYMENTS, access: AccessLevel.READ },
  { feature: Feature.ANALYTICS, access: AccessLevel.READ },
];

// Default policies untuk member (basic user)
export const MEMBER_DEFAULT_POLICIES = [
  { feature: Feature.BOOKINGS, access: AccessLevel.READ },
  { feature: Feature.SERVICES, access: AccessLevel.READ },
  { feature: Feature.SETTINGS, access: AccessLevel.DISABLED },
  { feature: Feature.MEMBERS, access: AccessLevel.DISABLED },
  { feature: Feature.PAYMENTS, access: AccessLevel.DISABLED },
  { feature: Feature.ANALYTICS, access: AccessLevel.DISABLED },
];

/**
 * Get default policies berdasarkan role
 */
export function getDefaultPolicies(role: MemberRole) {
  switch (role) {
    case MemberRole.OWNER:
      return OWNER_DEFAULT_POLICIES;
    case MemberRole.ADMIN:
      return ADMIN_DEFAULT_POLICIES;
    case MemberRole.STAFF:
      return STAFF_DEFAULT_POLICIES;
    case MemberRole.MEMBER:
      return MEMBER_DEFAULT_POLICIES;
    default:
      return MEMBER_DEFAULT_POLICIES;
  }
}

/**
 * Get business member dengan policies
 */
export async function getBusinessMember(userId: string, businessId: string) {
  return await prisma.businessMember.findUnique({
    where: {
      userId_businessId: {
        userId,
        businessId,
      },
    },
    include: {
      policies: true,
    },
  });
}

/**
 * Check apakah user punya akses ke business
 */
export async function hasBusinessAccess(userId: string, businessId: string): Promise<boolean> {
  const member = await prisma.businessMember.findFirst({
    where: {
      userId,
      businessId,
      status: 'active',
    },
  });

  return !!member;
}

/**
 * Check apakah user bisa READ feature tertentu
 */
export async function canRead(userId: string, businessId: string, feature: Feature): Promise<boolean> {
  const member = await getBusinessMember(userId, businessId);

  if (!member || member.status !== 'active') {
    return false;
  }

  const policy = member.policies.find(p => p.feature === feature);

  if (!policy) {
    return false;
  }

  return policy.access === AccessLevel.READ || policy.access === AccessLevel.WRITE;
}

/**
 * Check apakah user bisa WRITE feature tertentu
 */
export async function canWrite(userId: string, businessId: string, feature: Feature): Promise<boolean> {
  const member = await getBusinessMember(userId, businessId);

  if (!member || member.status !== 'active') {
    return false;
  }

  const policy = member.policies.find(p => p.feature === feature);

  if (!policy) {
    return false;
  }

  return policy.access === AccessLevel.WRITE;
}

/**
 * Get access level untuk feature tertentu
 */
export async function getAccessLevel(
  userId: string,
  businessId: string,
  feature: Feature
): Promise<AccessLevel> {
  const member = await getBusinessMember(userId, businessId);

  if (!member || member.status !== 'active') {
    return AccessLevel.DISABLED;
  }

  const policy = member.policies.find(p => p.feature === feature);

  if (!policy) {
    return AccessLevel.DISABLED;
  }

  return policy.access as AccessLevel;
}

/**
 * Get all permissions untuk user di business tertentu
 */
export async function getUserPermissions(userId: string, businessId: string) {
  const member = await getBusinessMember(userId, businessId);

  if (!member || member.status !== 'active') {
    return null;
  }

  const permissions: Record<string, AccessLevel> = {};

  member.policies.forEach(policy => {
    permissions[policy.feature] = policy.access as AccessLevel;
  });

  return {
    member,
    permissions,
  };
}

/**
 * Check apakah user adalah owner dari business
 */
export async function isOwner(userId: string, businessId: string): Promise<boolean> {
  const member = await prisma.businessMember.findFirst({
    where: {
      userId,
      businessId,
      role: MemberRole.OWNER,
      status: 'active',
    },
  });

  return !!member;
}

/**
 * Create business member dengan default policies
 */
export async function createBusinessMember(
  userId: string,
  businessId: string,
  role: MemberRole,
  invitedBy?: string,
  tx?: any // Optional transaction client
) {
  const db = tx || prisma; // Use transaction client if provided, otherwise use prisma

  // Create member
  const member = await db.businessMember.create({
    data: {
      userId,
      businessId,
      role,
      invitedBy,
      status: 'active',
    },
  });

  // Create default policies
  const defaultPolicies = getDefaultPolicies(role);

  await db.memberPolicy.createMany({
    data: defaultPolicies.map(policy => ({
      businessMemberId: member.id,
      feature: policy.feature,
      access: policy.access,
    })),
  });

  return member;
}

/**
 * Update policy untuk member
 */
export async function updateMemberPolicy(
  businessMemberId: string,
  feature: Feature,
  access: AccessLevel
) {
  return await prisma.memberPolicy.upsert({
    where: {
      businessMemberId_feature: {
        businessMemberId,
        feature,
      },
    },
    create: {
      businessMemberId,
      feature,
      access,
    },
    update: {
      access,
    },
  });
}

/**
 * Remove member dari business
 */
export async function removeMember(businessMemberId: string) {
  return await prisma.businessMember.update({
    where: { id: businessMemberId },
    data: {
      status: 'left',
    },
  });
}
