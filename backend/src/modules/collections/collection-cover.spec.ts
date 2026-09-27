import { readCmsCover, resolveCollectionCover } from './collection-cover';

describe('collection cover image', () => {
  it('uses the admin cover for a collection instead of the first product photo', () => {
    expect(
      resolveCollectionCover({
        cmsCover: '/uploads/solo-cover.jpg',
        productImage: '/uploads/first-product.jpg',
        image: '/uploads/legacy.jpg',
        coverMode: 'custom',
      }),
    ).toBe('/uploads/solo-cover.jpg');
  });

  it('keeps a manually chosen standalone cover when the admin has not set one', () => {
    expect(
      resolveCollectionCover({
        coverMode: 'custom',
        image: '/uploads/alder-cover.jpg',
        productImage: '/uploads/first-product.jpg',
      }),
    ).toBe('/uploads/alder-cover.jpg');
  });

  it('falls back to the first product photo', () => {
    expect(
      resolveCollectionCover({
        coverMode: 'product',
        image: '/uploads/stale.jpg',
        productImage: '/uploads/first-product.jpg',
      }),
    ).toBe('/uploads/first-product.jpg');
  });

  it('returns the product photo again after the admin cover is cleared', () => {
    expect(
      resolveCollectionCover({
        cmsCover: '   ',
        coverMode: 'custom',
        image: '/uploads/alder-cover.jpg',
        productImage: '/uploads/first-product.jpg',
      }),
    ).toBe('/uploads/alder-cover.jpg');
    expect(
      resolveCollectionCover({
        cmsCover: '',
        productImage: '/uploads/first-product.jpg',
      }),
    ).toBe('/uploads/first-product.jpg');
  });

  it('reads only an explicit cover from a collection entry', () => {
    expect(readCmsCover({ data: { coverImage: ' /uploads/cover.jpg ' } })).toBe(
      '/uploads/cover.jpg',
    );
    expect(readCmsCover({ data: { image: '/uploads/gallery.jpg' } })).toBe('');
    expect(readCmsCover(null)).toBe('');
  });
});
