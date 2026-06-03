# RLS Policies

RLS is required for all app tables.

## Helpers

- `is_tenant_member(target_tenant uuid)`: true when the current user belongs to a tenant.
- `tenant_member_role(target_tenant uuid)`: returns the current user's tenant role.
- `is_tenant_admin(target_tenant uuid)`: true for owner or admin.

## Step 1 Rules

- Users can read and update only their own profile.
- Tenant members can read their own tenant.
- Only owners/admins can update tenant data.
- Tenant members can read tenant settings.
- Only owners/admins can write tenant settings.
- Tenant members can read channel bindings.
- Only owners/admins can write channel bindings.
- Tenant members can read memberships in their tenant.

## Step 2 Rules

- Tenant members can read catalog categories and catalog items for their own tenant.
- Only owners/admins can create, update, or delete catalog categories.
- Only owners/admins can create, update, or delete catalog items.
- Catalog items cannot point at a category from another tenant.

## Step 3 Rules

- Tenant members can read conversations and messages for their own tenant.
- Tenant members can create and update conversations for their own tenant.
- Tenant members can add message records for their own tenant.
- Only owners/admins can delete conversations or update/delete message records.
- Messages cannot point at a conversation from another tenant.

## Step 4 Rules

- Tenant members can read channel bindings for their own tenant.
- Only owners/admins can create, update, or delete channel bindings.
- Conversations cannot point at a channel binding from another tenant or mismatched channel.

## Step 5 Rules

- Tenant members can read WhatsApp beta session records for their own tenant.
- Only owners/admins can create, update, or delete WhatsApp beta session records.
- WhatsApp beta sessions must point at a same-tenant WhatsApp `channel_bindings` row with provider `unipile_beta`.

## Cross-Tenant Rule

No client code should use service-role credentials. Cross-tenant reads and writes must fail under the browser/session role.
