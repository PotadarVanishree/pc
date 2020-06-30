package gw.webservice.ImplWebservice
uses gw.xml.ws.annotation.WsiExportable
uses java.util.Date
@WsiExportable
final class AccountType {
  var _accountPublicId  : String as AccountPublicId
  var _countOfPolicyOnTheAccount  : String as CountOfPolicyOntheAccount
  var _listOfPolicyNumbers  : String[] as ListOfPolicyNumbers
}