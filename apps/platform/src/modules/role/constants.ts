export const ROLES = ["KITCHEN_STAFF",
  "WAREHOUSE_MANAGER",
  "SCHOOL_ADMIN",
  "VENDOR_MANAGER",
  "AUDITOR"]as const;

export type RoleType = typeof ROLES[number];