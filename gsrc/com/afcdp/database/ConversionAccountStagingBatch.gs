package com.afcdp.database

uses gw.processes.BatchProcessBase
uses java.lang.Exception
uses java.util.ArrayList
uses java.sql.Connection
uses java.sql.PreparedStatement
uses java.sql.ResultSet
uses java.sql.Date
uses ErrorType
uses com.afcdp.database.AFCConnectionManager
 uses com.afcdp.database.AFCQueryManager

/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 5/26/20
 * Time: 3:26 PM
 * To change this template use File | Settings | File Templates.
 */
class ConversionAccountStagingBatch extends BatchProcessBase {
  construct() {
    super(BatchProcessType.TC_ACCOUNTCONTROLSTAGING)
  }

  override function doWork() {
    // connect Legacy DB
     var legacyAccountNumbers = findLegacyAccountsToGeneratePayload()
    if(legacyAccountNumbers.Empty){
      print("No accounts to generate payload.")
      return
    }
      legacyAccountNumbers.each(\legacyAccNum -> {
        try {
          findLegacyDataForAccountAndCreateAndInsertPayload(legacyAccNum)
        } catch(exception: Exception) {
          incrementOperationsFailed()
          incrementOperationsFailedReasons(exception.Message)
        } finally{
          incrementOperationsCompleted()
        }
      })
  }
  private  function findLegacyAccountsToGeneratePayload():List<String>{
    var retList = new ArrayList<String>()
    var stagingDBConnection:Connection
    var preparedStatement:PreparedStatement
    try{
      stagingDBConnection = AFCConnectionManager.createStagingDBConnection()
      if(stagingDBConnection == null){
        throw new Exception ("No DB Connection to Staging DB. Cannot query for policies to generate payload")

      }
      preparedStatement = stagingDBConnection.prepareStatement(AFCQueryManager.querySelectAccNumsToGenPayload)
      var resultSet = preparedStatement.executeQuery()
      while(resultSet.next())  {
        //retList.add(resultSet)
        retList.add(resultSet.getString("AccountNumber"))
      }
    } catch(ex:Exception){
      ex.printStackTrace()
           print("Error in batch" + this.Class.Name + ":" + ex.Message)
        } finally{
      if(preparedStatement !=null) {
        try{
          preparedStatement.close()
          }catch(ex:Exception){
          print("Error in batch"+ this.Class.Name + ":"+ ex.Message)
        }
      }

      if(stagingDBConnection != null){
        try{

          stagingDBConnection.close()
        } catch(ex:Exception){
          print("Error in batch"+ this.Class.Name + ":" + ex.Message)
        }
      }
    }
    return retList
    }

private  function findLegacyDataForAccountAndCreateAndInsertPayload(accNum:String):List<String>{
         var returnList = new ArrayList<String>()
  var legacyDBConnection : Connection
  var preparedStatement :PreparedStatement
  try {
    // legacyDBConnection = AFCConnectionManager.createLegacyDBConnection()
     legacyDBConnection = AFCConnectionManager.createLegacyDBConnection()
    if(legacyDBConnection == null){
      throw new Exception ("No DB Connection to Legacy DB. Cannot query for legacy account data for account number:" +accNum)
    }
    //var accountExists = findAccountInStagingTableAndUpdateErrorMessage(accNum)
   //if(!accountExists)
    preparedStatement = legacyDBConnection.prepareStatement(AFCQueryManager.querySelectLegacyAccountData)
      preparedStatement.setObject(1, accNum)
    var resultSet = preparedStatement.executeQuery()
    while(resultSet.next()){
      var payload = createXMLObjFromResultSet(resultSet)
      insertPayloadIntoStagingDB(accNum, payload)

    }


  } catch(ex:Exception) {
    print("Error in batch"+ this.Class.Name + ":"+ ex.Message)
  }finally{
    if(preparedStatement != null){
      try{
        preparedStatement.close()
      } catch(ex:Exception){
        print("Error in batch"+ this.Class.Name + ":"+ ex.Message)
      }
    }
    if(legacyDBConnection !=null){
      try{
        legacyDBConnection.close()
      } catch(ex:Exception){
        print("Error in batch"+ this.Class.Name + ":"+ ex.Message)
      }
    }
  }
   return returnList
  }

  function createXMLObjFromResultSet(resultSet: ResultSet):String {
    var accountXMLObj =  new com.afcdpt.conversion.gxmodel.account.accountmodel.Account()
    accountXMLObj.AccountNumber = resultSet.getString("AC_ACCNUM")
    accountXMLObj.AccountOrgType = resultSet.getString("AC_ORGTYP")
    accountXMLObj.BusOpsDesc = resultSet.getString("AC_BUSDESC")
    accountXMLObj.IndustryCode.Code = resultSet.getString("AC_INDCD")
    accountXMLObj.ServiceTier = resultSet.getString("AC_SERVTIER")

    var accLocationEntry = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_AccountLocations_Entry()
    accLocationEntry.AddressLine1 = resultSet.getString("AL_AL1")
    accLocationEntry.AddressLine2 = resultSet.getString("AL_AL2")
    accLocationEntry.AddressLine3 = resultSet.getString("AL_AL3")
    accLocationEntry.City = resultSet.getString("AL_CITY")
    accLocationEntry.Country = resultSet.getString("AL_CNTRY")
    accLocationEntry.State = resultSet.getString("AL_STATE")
    accLocationEntry.PostalCode = resultSet.getString("AL_POSTALCD")
    accLocationEntry.County = resultSet.getString("AL_CNTY")
    accLocationEntry.Description = resultSet.getString("AL_DESC")

    var accLocationSet = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_AccountLocations()
     accLocationSet.addChild(accLocationEntry)
     accountXMLObj.AccountLocations = accLocationSet
    var primaryLocation = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_PrimaryLocation()
    primaryLocation.AddressLine1 = resultSet.getString("AL_AL1")
    primaryLocation.AddressLine2 = resultSet.getString("AL_AL2")
    primaryLocation.AddressLine3 = resultSet.getString("AL_AL3")
    primaryLocation.City = resultSet.getString("AL_CITY")
    primaryLocation.Country = resultSet.getString("AL_CNTRY")
    primaryLocation.State = resultSet.getString("AL_STATE")
    primaryLocation.PostalCode = resultSet.getString("AL_POSTALCD")
    primaryLocation.County = resultSet.getString("AL_CNTY")
    primaryLocation.Description = resultSet.getString("AL_DESC")
    accountXMLObj.PrimaryLocation = primaryLocation

    var accHolderContact = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_AccountHolderContact()
    var contactEntityPerson =  new com.afcdpt.conversion.gxmodel.account.contactmodel.anonymous.elements.Contact_Entity_Person()
    contactEntityPerson.FirstName = resultSet.getString("CO_FNAME")
    contactEntityPerson.LastName = resultSet.getString("CO_LNAME")
    accHolderContact.entity_Person =contactEntityPerson
    accHolderContact.Name = resultSet.getString("CO_NAME")
    accHolderContact.Subtype = resultSet.getString("CO_SUBTYP")
    accHolderContact.EmailAddress1 = resultSet.getString("CO_EMAIL1")
    accHolderContact.EmailAddress2 = resultSet.getString("CO_EMAIL2")
    accHolderContact.FaxPhone = resultSet.getString("CO_FAXPH")
    accHolderContact.WorkPhone = resultSet.getString("CO_WORKPH")

    var primaryAddress = new com.afcdpt.conversion.gxmodel.account.contactmodel.anonymous.elements.Contact_PrimaryAddress()
    primaryAddress.AddressLine1 = resultSet.getString("AD_AL1")
    primaryAddress.AddressLine2 = resultSet.getString("AD_AL2")
    primaryAddress.AddressLine3 = resultSet.getString("AD_AL3")
    //primaryAddress.AddressType = resultSet.getString("AD_ADTYPE")
    primaryAddress.City = resultSet.getString("AD_CITY")
    primaryAddress.Country = resultSet.getString("AD_CNTRY")
    primaryAddress.County = resultSet.getString("AD_CNTY")
    primaryAddress.Description = resultSet.getString("AD_DESC")
    primaryAddress.PostalCode = resultSet.getString("AD_POSTAL")
    primaryAddress.State = resultSet.getString("AD_STATE")
    accHolderContact.PrimaryAddress = primaryAddress
    accountXMLObj.AccountHolderContact = accHolderContact

    var producerCodeEntry = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_ProducerCodes_Entry()
    producerCodeEntry.ProducerCode.Code = resultSet.getString("PC_PRODCD")
    var producerCodeSet = new com.afcdpt.conversion.gxmodel.account.accountmodel.anonymous.elements.Account_ProducerCodes()
    producerCodeSet.addChild(producerCodeEntry)
    accountXMLObj.ProducerCodes = producerCodeSet
    return accountXMLObj.asUTFString()
}

 function insertPayloadIntoStagingDB(accNum:String,payload:String){
   var stagingDBConnection:Connection
   var preparedStatement:PreparedStatement
   try {
     stagingDBConnection = AFCConnectionManager.createStagingDBConnection()
     if(stagingDBConnection == null){
       throw new Exception("No DB Connection to Legacy DB. Cannot query for legacy account data for account number:" + accNum)
     }
     preparedStatement = stagingDBConnection.prepareStatement(AFCQueryManager.queryInsertPayloadIntoStaging)
      preparedStatement.setObject(1,accNum)
     preparedStatement.setObject(2,payload)
      var insertRows = preparedStatement.executeUpdate()
     if(insertRows == 1){
       updateAccountPayloadGenerated(accNum)
     }else{
       print("Error could not insert payload in staging table for account number :"+accNum)
     }
   } catch(ex:Exception){
     print("Error while inserting payload in staging table for account number :"+accNum)
     print("Error in Batch"+this.Class.Name+":"+ex.Message)

   } finally{
     if(preparedStatement != null){
       try {
         preparedStatement.close()
       }catch(ex:Exception){
         print("Error in Batch"+this.Class.Name+":"+ex.Message)
       }
     }
     if(stagingDBConnection != null){
       try{
         stagingDBConnection.close()
       } catch(ex:Exception){
         print("Error in Batch"+this.Class.Name+":"+ex.Message)
       }
     }
   }
 }
  function updateAccountPayloadGenerated(accNum:String){

    var stagingDBConnection:Connection
    var preparedStatement:PreparedStatement
    try {
      stagingDBConnection = AFCConnectionManager.createStagingDBConnection()
      if(stagingDBConnection == null){
        throw new Exception("No DB Connection to Legacy DB. Can not update success of creation of account payload for account number:" + accNum)
      }
      preparedStatement = stagingDBConnection.prepareStatement(AFCQueryManager.queryUpdateAccountPayloadGenerated)
      preparedStatement.setObject(1,Date.Today.toSQLDate())
      preparedStatement.setObject(2,accNum)
      var insertRows = preparedStatement.executeUpdate()
      if(insertRows == 1){

        print(" Update succes of account payload creation for account number :"+accNum)
      }
    } catch(ex:Exception){

      print("Error in Batch"+this.Class.Name+":"+ex.Message)

    } finally{
      if(preparedStatement != null){
        try {
          preparedStatement.close()
        }catch(ex:Exception){
          print("Error in Batch"+this.Class.Name+":"+ex.Message)
        }
      }
      if(stagingDBConnection != null){
        try{
          stagingDBConnection.close()
        } catch(ex:Exception){
          print("Error in Batch"+this.Class.Name+":"+ex.Message)
        }
      }
    }
  }



}
