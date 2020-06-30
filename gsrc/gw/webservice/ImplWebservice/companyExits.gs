package gw.webservice.ImplWebservice
uses gw.xml.ws.annotation.WsiExportable
uses java.util.Date
@WsiExportable
final class companyExits {
  var _jobSubType  : String as JobSubType
  var _policyNumber  : String as PolicyNumber
  var _policyEffectiveDate  : Date as PolicyEffectiveDate
  var _policyExDate  : Date as PolicyExDate
}