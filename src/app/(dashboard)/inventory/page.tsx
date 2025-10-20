import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';

export default async function InventoryPage() {
  const products = await prisma.inventoryProduct.findMany({
    include: {
      locationBins: { include: { bin: { include: { location: true } } } }
    },
    take: 40
  });

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Inventory & Procurement</h1>
        <p className="text-sm text-slate-400">
          Track SKUs, barcodes, suppliers, min/max levels, procurement, stocktakes and usage from service BOMs.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <Card key={product.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{product.name}</h2>
                <p className="text-xs text-slate-500">SKU {product.sku}</p>
              </div>
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-100">
                £{Number(product.retailPrice).toFixed(2)}
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              {product.locationBins.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between">
                  <span>
                    {stock.bin.location.name} · {stock.bin.name}
                  </span>
                  <span>{Number(stock.quantity).toFixed(0)} units</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
