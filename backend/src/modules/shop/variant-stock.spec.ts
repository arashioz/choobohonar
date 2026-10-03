import { applyInStockFlag } from './variant-stock';

describe('variant stock', () => {
  it('keeps an unsellable variant disabled when the product is marked in stock', () => {
    const next = applyInStockFlag(
      {
        inStock: true,
        variants: [
          { sku: '180', options: [{ name: 'سایز', value: '180' }], price: 200, stockQty: 2, enabled: true },
          { sku: '140', options: [{ name: 'سایز', value: '140' }], price: 170, stockQty: 3, enabled: false },
        ],
      },
      true,
    );

    expect(next.variants?.map((variant) => [variant.sku, variant.enabled, variant.stockQty])).toEqual([
      ['180', true, 2],
      ['140', false, 3],
    ]);
  });

  it('does not revive the first variant when every combination was turned off', () => {
    const next = applyInStockFlag(
      {
        variants: [
          { sku: '140', options: [{ name: 'سایز', value: '140' }], stockQty: 0, enabled: false },
        ],
      },
      true,
    );

    expect(next.variants?.[0].enabled).toBe(false);
    expect(next.inStock).toBe(true);
  });
});
