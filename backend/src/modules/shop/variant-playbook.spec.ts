import { classifyAttribute, presentShopProduct, resolvePlaybookFamily } from './variant-playbook';

describe('variant playbook', () => {
  it('maps sofa and bed families from category labels', () => {
    expect(resolvePlaybookFamily({ category: 'کاناپه' })).toBe('sofa');
    expect(resolvePlaybookFamily({ category: 'تخت خواب', name: 'تخت خواب فولیا' })).toBe('bed');
    expect(resolvePlaybookFamily({ category: 'میزتلویزیون' })).toBe('cabinet');
  });

  it('keeps sofa fabric as display unless it is on a priced SKU', () => {
    expect(classifyAttribute('پارچه', ['کاپری دو'], { category: 'کاناپه' }).role).toBe('display');
    expect(
      classifyAttribute('پارچه', ['کاپری دو'], { category: 'کاناپه', onPricedVariant: true }).role,
    ).toBe('purchase');
  });

  it('annotates API attributes without mutating stored fields besides role/ui', () => {
    const presented = presentShopProduct({
      name: 'کاناپه آلدر',
      category: 'کاناپه',
      room: 'living',
      attributes: [
        { name: 'ظرفیت', values: ['سه نفره', 'دو نفره'], required: false },
        { name: 'پارچه', values: ['کاپری دو'], required: false },
      ],
      variants: [
        { enabled: true, price: 100, options: [{ name: 'ظرفیت', value: 'سه نفره' }] },
      ],
    });
    expect(presented.attributes?.map((attribute) => [attribute.name, attribute.role])).toEqual([
      ['ظرفیت', 'purchase'],
      ['پارچه', 'display'],
    ]);
  });

  it('shows a priced product type as a purchase option', () => {
    expect(
      classifyAttribute('نوع', ['ایستاده', 'رومیزی'], {
        category: 'آباژور ایستاده',
        name: 'آباژور موکاییت',
        onPricedVariant: true,
      }).role,
    ).toBe('purchase');
    expect(
      classifyAttribute('نوع', ['پایه دار', 'ساده'], {
        category: 'دیوارکوب',
        name: 'دیوارکوب اونیکس',
        onPricedVariant: true,
      }).role,
    ).toBe('purchase');
    expect(classifyAttribute('نوع', ['رومیزی'], { category: 'آباژور', onPricedVariant: true }).role).toBe('ignore');
    expect(classifyAttribute('دسته', ['آباژور'], { category: 'آباژور', onPricedVariant: true }).role).toBe('ignore');
  });

  it('shows priced نوع choices on lamps instead of treating them as categories', () => {
    expect(classifyAttribute('نوع', ['ایستاده', 'رومیزی'], { category: 'آباژور', name: 'آباژور موکاییت', onPricedVariant: true }).role).toBe('purchase');
    expect(classifyAttribute('نوع', ['پایه دار', 'ساده'], { category: 'دیوارکوب', name: 'دیوارکوب اونیکس', onPricedVariant: true }).role).toBe('purchase');
    expect(classifyAttribute('نوع', ['رومیزی'], { category: 'آباژور', name: 'آباژور روندا', onPricedVariant: true }).role).toBe('purchase');
    expect(classifyAttribute('نوع', ['آباژور'], { category: 'آباژور' }).role).toBe('ignore');
  });

  it('hides mattress construction from storefront options', () => {
    expect(classifyAttribute('ساختار', ['فنر متصل'], { category: 'تشک', name: 'تشک الارا' }).role).toBe('ignore');
    expect(classifyAttribute('سایز', ['180', '90'], { category: 'تشک', name: 'تشک الارا' }).role).toBe('purchase');
  });

  it('omits the dimension-range attribute from the storefront payload', () => {
    const presented = presentShopProduct({
      name: 'میز غذاخوری ساپلی',
      category: 'میز غذاخوری',
      attributes: [
        { name: 'طول', values: ['100 - 109', '160 - 169'], required: false },
        { name: 'سایز', values: ['ده نفره', 'چهار نفره'], required: true },
      ],
      variants: [
        { enabled: true, price: 100, options: [{ name: 'سایز', value: 'ده نفره' }, { name: 'طول', value: '160 - 169' }] },
      ],
    });
    expect(presented.attributes?.map((attribute) => attribute.name)).toEqual(['سایز']);
    expect(presented.variants?.[0].options?.map((option) => option.name)).toEqual(['سایز']);
  });
});
