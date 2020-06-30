package gw.plugin.billing

uses gw.web.account.AccountBillingUIHelper

/**
 * account search result enhancement
 */
@Export
enhancement BillingAccountSearchResultEnhancement : gw.plugin.billing.BillingAccountSearchResult {
  property get DisplayName() : String{
    return AccountBillingUIHelper.renderAccount(this.AccountNumber, this.AccountName)
  }
}
