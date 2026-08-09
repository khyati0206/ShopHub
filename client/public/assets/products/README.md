# Custom Product Images

Drop your own product photos here to replace stock images for specific products.

## Folder structure

```
assets/products/
├── probook-gaming-laptop/
│   ├── 1.jpg    ← main image (product card)
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
├── wireless-headphones/
│   └── ...
```

## How to enable custom images

In `server/seed/productsCatalog.js`, find the product by `slug` and set:

```js
useLocalImages: true,
```

Then re-run: `npm run seed`

## Or edit images directly

Set the `images` array to explicit paths (works with or without `useLocalImages`):

```js
images: [
  '/assets/products/my-product/1.jpg',
  '/assets/products/my-product/2.jpg',
],
```

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

Recommended size: **800×800 px** (square) for consistent grid alignment.
