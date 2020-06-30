package gw.plugin.processing
uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses gw.processes.PolicyRenewalClearCheckDate
uses gw.processes.ApplyPendingAccountDataUpdates
uses gw.processes.SolrDataImportBatchProcess
uses com.afcdpt.conversion.gxmodel.account.account.ConversionAccountBatch
uses com.afcdp.database.ConversionAccountStagingBatch
uses com.afcdpt.conversion.gxmodel.account.policyConversionBatch.ConversionPolicyStagingBatch
uses com.afcdpt.conversion.gxmodel.account.policyConversionBatch.ConversionPolicyLoadBatch

@Export
class ProcessesPlugin implements IProcessesPlugin {

  construct() {
  }

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_POLICYRENEWALCLEARCHECKDATE:
        return new PolicyRenewalClearCheckDate()
      case BatchProcessType.TC_APPLYPENDINGACCOUNTDATAUPDATES:
        return new ApplyPendingAccountDataUpdates()
      case BatchProcessType.TC_SOLRDATAIMPORT:
        return new SolrDataImportBatchProcess()
      case BatchProcessType.TC_ACCOUNTCONVERSION:
        return new ConversionAccountBatch()
      case BatchProcessType.TC_ACCOUNTCONTROLSTAGING:
        return new ConversionAccountStagingBatch()
      case BatchProcessType.TC_POLICYCONTROLSTAGING:
          return new ConversionPolicyStagingBatch()
      case BatchProcessType.TC_POLICYCONVERSION:
          return new ConversionPolicyLoadBatch()
      default:
        return null
    }
  }

}
