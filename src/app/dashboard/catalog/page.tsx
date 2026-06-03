import { CatalogManager } from "@/components/catalog/catalog-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { getCatalogForTenant } from "@/lib/data/catalog";
import {
  canManageTenant,
  requireTenantContext,
} from "@/lib/data/tenant";

export default async function CatalogPage() {
  const tenantContext = await requireTenantContext();
  const { categories, items } = await getCatalogForTenant(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 2"
        title="Catalog"
        description="Manage tenant-scoped products and services for future Venta Viva recommendations, carts, checkout, and Reserva Viva service workflows."
      />

      <CatalogManager
        categories={categories}
        items={items}
        canEdit={canManageTenant(tenantContext.role)}
      />
    </div>
  );
}
