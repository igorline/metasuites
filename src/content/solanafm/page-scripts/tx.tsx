import { store } from '@src/store'

import { renderTxPageAddressLabels } from '../feat-scripts'
import { lazyLoad } from '../helper'

const initTxPageScript = async () => {
  const { enhancedLabels } = await store.get('options')
  lazyLoad(() => {
    if (enhancedLabels) renderTxPageAddressLabels()
  }, '[data-testid="oval-loading"]')
}

export default initTxPageScript