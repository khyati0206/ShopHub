/**
 * Image helpers for seed data.
 *
 * CUSTOM IMAGES: To override stock photos for a product, set `useLocalImages: true`
 * and place files in `client/public/assets/products/{slug}/` (e.g. 1.jpg, 2.jpg).
 * Or replace the `images` array directly with paths like `/assets/products/my-slug/1.jpg`.
 */

export const IMAGE_SIZE = 800;

/** Build a square-cropped Unsplash image URL (800×800). */
export const unsplash = (photoId, variant = 0) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${IMAGE_SIZE}&h=${IMAGE_SIZE}&q=80&sig=${variant}`;

/** Build a square-cropped Pexels image URL (800×800). */
export const pexels = (photoId) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${IMAGE_SIZE}&h=${IMAGE_SIZE}&fit=crop`;

/** Build an array of Unsplash URLs from photo IDs. */
export const stockImages = (...photoIds) => photoIds.map((id, i) => unsplash(id, i));

/** Build an array of Pexels URLs from numeric photo IDs. */
export const pexelsImages = (...photoIds) => photoIds.map((id) => pexels(id));

/** Local asset path under client/public/assets/products/ */
export const localImage = (slug, filename) => `/assets/products/${slug}/${filename}`;

/** Default local image set when useLocalImages is true (expects 1.jpg–5.jpg). */
export const localImageSet = (slug, count = 4) =>
  Array.from({ length: count }, (_, i) => localImage(slug, `${i + 1}.jpg`));

/**
 * Resolve final image list for seeding.
 * @param {string} slug - folder name under /assets/products/
 * @param {string[]|number[]} photoIds - Unsplash photo IDs or Pexels numeric IDs
 * @param {object} options
 * @param {boolean} options.useLocalImages - use local files instead of stock photos
 * @param {number} options.localCount - number of local images expected
 * @param {'pexels'|'unsplash'} options.source - stock photo provider (default: pexels)
 */
export const resolveProductImages = (
  slug,
  photoIds,
  { useLocalImages = false, localCount = 4, source = 'pexels' } = {}
) => {
  if (useLocalImages) {
    return localImageSet(slug, localCount);
  }
  if (source === 'unsplash') {
    return stockImages(...photoIds);
  }
  return pexelsImages(...photoIds);
};
