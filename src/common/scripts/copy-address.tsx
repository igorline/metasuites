import { createRoot } from 'react-dom/client'
import isMobile from 'is-mobile'
import React, { type FC, type ReactNode } from 'react'

import { CopyButton, IconPhalcon } from '@common/components'
import {
  pickAddress,
  getHrefQueryVariable,
  getChainSimpleName
} from '@common/utils'
import { PATTERN_EVM_TX_HASH, PHALCON_SUPPORT_LIST } from '@common/constants'
import { PHALCON_EXPLORER_DOMAIN } from '@common/config/uri'

const PhalconExplorerButton: FC<{ hash: string }> = ({ hash }) => {
  const chain = getChainSimpleName()

  const pathname = PHALCON_SUPPORT_LIST.find(
    item => item.chain === chain
  )?.pathname

  const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault()
    window.open(`${PHALCON_EXPLORER_DOMAIN}/tx/${pathname}/${hash}`, '_blank')
  }

  if (!chain) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <CopyButton text={hash} style={{ color: '#ADB5BD' }} />
      <IconPhalcon
        mode="dark"
        style={{ verticalAlign: 'middle' }}
        onClick={handleClick}
      />
    </span>
  )
}

const appendIconToElement = (
  el: HTMLElement,
  reactNode: ReactNode,
  isTxHash = false
) => {
  if (!isMobile()) {
    el.onmouseover = () => {
      const btnEls = el.querySelectorAll<HTMLElement>(
        '.__metadock-copy-address-btn__'
      )
      if (btnEls.length) {
        btnEls.forEach(btnEl => {
          btnEl.style.display = 'inline-block'
        })
      }
    }
    el.onmouseout = () => {
      const btnEls = el.querySelectorAll<HTMLElement>(
        '.__metadock-copy-address-btn__'
      )
      if (btnEls.length) {
        btnEls.forEach(btnEl => {
          btnEl.style.display = 'none'
        })
      }
    }
  }

  if (isTxHash) {
    el.setAttribute(
      'style',
      'padding-right:40px;position:relative;max-width:11rem;'
    )
  } else {
    el.setAttribute('style', 'padding-right:18px;position:relative')
  }
  const rootEl = document.createElement('span')
  rootEl.classList.add('__metadock-copy-address-btn__')
  if (isTxHash) {
    rootEl.setAttribute(
      'style',
      `position:absolute;right:0;display:${
        isMobile() ? 'inline-block' : 'none'
      };line-height:0;top: 50%;transform: translateY(-50%)`
    )
  } else {
    rootEl.setAttribute(
      'style',
      `position:absolute;right:0;display:${
        isMobile() ? 'inline-block' : 'none'
      }`
    )
  }
  el?.appendChild(rootEl)
  createRoot(rootEl).render(reactNode)
}

export const handleAddressNodeListCopy = (
  addressTags: NodeListOf<HTMLElement> | HTMLElement[]
) => {
  for (let i = 0; i < addressTags.length; i++) {
    const el = addressTags[i]
    let address: string | undefined
    const href = el.getAttribute('href')
    const dataOriginalTitle = el.getAttribute('data-original-title')
    const title = el.getAttribute('title')
    if (href) {
      const tokenAddress = getHrefQueryVariable(href, 'a')
      address = tokenAddress ?? pickAddress(href)
    } else if (dataOriginalTitle) {
      address = pickAddress(dataOriginalTitle)
    } else if (title) {
      address = pickAddress(title)
    } else {
      address = pickAddress(el.innerText)
    }
    if (address) appendIconToElement(el, <CopyButton text={address} />)
  }
}

export const handleTokenNodeListCopy = (tokenTags: NodeListOf<HTMLElement>) => {
  for (let i = 0; i < tokenTags.length; i++) {
    const el = tokenTags[i]
    const href = el.getAttribute('href')
    if (!href) continue
    const address = getHrefQueryVariable(href, 'a') ?? pickAddress(href)
    if (address) appendIconToElement(el, <CopyButton text={address} />)
  }
}

export const handleTxnNodeListCopy = (
  txnTags: NodeListOf<HTMLElement> | HTMLElement[],
  targetPosition: 'self' | 'parent' = 'parent'
) => {
  for (let i = 0; i < txnTags.length; i++) {
    const el = txnTags[i]
    const href = el.getAttribute('href')
    if (!href) continue
    const txnHash = href.match(PATTERN_EVM_TX_HASH)?.[0]
    const hashTagEl = targetPosition === 'parent' ? el.parentElement : el
    if (hashTagEl && txnHash) {
      appendIconToElement(
        hashTagEl,
        <PhalconExplorerButton hash={txnHash} />,
        true
      )
    }
  }
}

export const handleBlockNodeListCopy = (blockTags: NodeListOf<HTMLElement>) => {
  for (let i = 0; i < blockTags.length; i++) {
    const el = blockTags[i]
    const href = el.getAttribute('href')
    if (!href) continue
    const block = el.innerText.trim()
    appendIconToElement(el, <CopyButton text={block} />)
  }
}
