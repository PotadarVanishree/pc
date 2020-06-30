package com.afcdp.database
/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 5/26/20
 * Time: 2:27 PM
 * To change this template use File | Settings | File Templates.
 */
class AFCQueryManager {


      //query to check account control table for accounts to be converted
      public static final var querySelectAccNumsToGenPayload : String = "SELECT AccountNumber FROM tabl_accountcontrol WHERE ConvertedDate IS NULL ORDER BY RequestDate"

      //query to select all legacy data fields from a single view
      public  static  final var querySelectLegacyAccountData : String = " SELECT * FROM view_LegacyAccountData WHERE AC_ACCNUM = ?"

      //Query to insert the payload created into the staging table for conversion
      public  static final var queryInsertPayloadIntoStaging : String   = "INSERT INTO tabl_accountstaging(AccountNumber,Payload,Completed) values (?,?,0)"

      //query to update the account control table about success payload generation of given account
      public static final var queryUpdateAccountPayloadGenerated : String = "UPDATE tabl_accountcontrol SET ConvertedDate = ? WHERE AccountNumber = ? AND ConvertedDate is NULL"

      //query to set of account number and corresponding payload to be retrieved into pc for conversion
      public static final var querySelectAccPayloadToConvert : String = "Select AccountNumber, Payload FROM dbo.tabl_accountstaging WHERE Completed <> 1 AND ErrorReason IS NULL"

      //query success conversion , update the staging table for
      public static final var queryUpdateAccountPayloadConverted : String = "UPDATE tabl_accountstaging SET Completed = 1, ErrorReason = ? WHERE AccountNumber = ? AND Completed = 0"

      //query to get count for accountNumber Exists or not in staging table
      public static final var querySelectAccountExistsOrNotInStaging : String = "Select AccountNumber FROM  tabl_accountstaging WHERE AccountNumber = ?"

      //query to update accountnumber is already exists in staging table
      public static final var queryUpdateAccIsAlreadyExists : String = "UPDATE tabl_accountstaging SET  ErrorReason = ? WHERE AccountNumber = ? "

      //query to get the count for account number exists or not in staging table
      public static final var querySelectAccExistsOrNotInStaging : String = "Select AccountNumber FROM  tabl_accountstaging WHERE AccountNumber = ? AND  Completed = 1"

      //query to get set of account number and corresponding payload to be retrieved into pc for conversion
      public static final var querySelectDmAcctPayloadToConvert : String = "Select id, Payload FROM dbo.DmAcctPayload WHERE status IS NULL"

     //After success conversion , update the staging table for
      public static final var queryUpdateDMAccPayloadConverted: String = "UPDATE dbo.DmAcctPayload SET status='SUCCESS' WHERE id = ?"

     //query for update if account is already exists
      public static final var queryUpdateDMAccountExists: String = "UPDATE dbo.DmAcctPayload SET status='ERROR',error_message = 'Existing Account' WHERE id = ?"



}
