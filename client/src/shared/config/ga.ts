// src/shared/config/ga.ts

export const GA_CTA_EVENTS = {
  onClickAppDownloadCTA: 'click_cta_app_download',
  onClickNavigationCTA: 'click_cta_navigation',
  onClickBannerCTA: 'click_cta_banner',
  onClickCartCTA: 'click_cta_cart',
  onClickCheckout: 'click_cta_checkout',
} as const;

export type GA_CTA_EVENT = (typeof GA_CTA_EVENTS)[keyof typeof GA_CTA_EVENTS];
