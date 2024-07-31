import { CONFIG } from 'src/config-global';

import ProductsV2View from 'src/sections/products-v2/view/products-v2-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page two | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ProductsV2View />;
}
