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
});
