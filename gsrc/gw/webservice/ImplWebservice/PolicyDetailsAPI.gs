package gw.webservice.ImplWebservice
uses gw.xml.ws.annotation.WsiWebService
uses gw.xsd.w3c.soap11_encoding.String
uses gw.api.database.Query
uses com.sun.org.apache.xpath.internal.operations.Equals
@WsiWebService
 class PolicyDetailsAPI  {
    /**
     * Web service method to get  policydetails.
     * @param jobNumber String
     *
     */
function getCompanyExits (JobNumber : String) : companyExits {
          var job = gw.api.database.Query.make(Job).compare(Job#JobNumber,Equals ,JobNumber)  .select()  .first()
          var companyExits = new companyExits()
          companyExits.JobSubType = job.Subtype.DisplayName
          companyExits.PolicyNumber = job.LatestPeriod.PolicyNumber
          companyExits.PolicyEffectiveDate = job.LatestPeriod.PolicyStartDate
          companyExits.PolicyExDate = job.LatestPeriod.PolicyEndDate
          return companyExits



          /**
           *
           * @returns CompanyExists
           */



          /**
           * Web service method to get  Accountdetails.
           * @param AccountNumber String
           *
           */
        }
function getAccountExits (AccountNumber : String) : AccountType {
          var acc = gw.api.database.Query.make(Account)  .select()  .first()
          var accountExits = new AccountType()
          accountExits.AccountPublicId = acc.AccountNumber
          accountExits.CountOfPolicyOntheAccount = acc.Policies.Count as String
          accountExits.ListOfPolicyNumbers = acc.Policies*.Periods*.PolicyNumber.toSet().toTypedArray()
          return accountExits
          /**
           *
           * @returns AccountType
           */
          /**
           * Web service method to get  polici period year through publc ID.
           * @param publicId String
           * @param year String
           */



        }
function getPublicIdR (publicId : String, year : String) {
          var pid = gw.api.database.Query.make(PolicyPeriod).compare(PolicyPeriod#PublicID, Equals, publicId).select().first()
          var slicedPeriod = pid.getSlice(pid.EditEffectiveDate)
          gw.transaction.Transaction.runWithNewBundle(\b->{
            slicedPeriod = b.add(slicedPeriod)
            slicedPeriod.Policy.Account.YearBusinessStarted = year as int
          },"su")

             //return  slicedPeriod
           }

}






