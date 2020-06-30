package com.afcdp.database
/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 6/2/20
 * Time: 2:27 PM
 * To change this template use File | Settings | File Templates.
 */
class AFCPolicyQueryManager {

 //query to check account control table for policies to be converted
 public static final var querySelectPolNumsToGenPayload: String = "SELECT PolicyNumber FROM tabl_policycontrol WHERE ConvertedDate IS NULL ORDER BY RequestDate"

//query to select all legacy data fields from a single view
public  static  final var querySelectLegacyPolicyData: String = " SELECT * FROM view_LegacyPolicyData WHERE PP_POLNUM = ?"

//Query to insert the payload created into the staging table for conversion
public static final var queryInsertPolicyPayloadIntoStaging : String   = "INSERT INTO tabl_policystaging(PolicyNumber,Payload,Completed) values (?,?,0)"

//query to update the policy control table about success payload generation of given policy
public static final var queryUpdatePolicyPayloadGenerated: String = "UPDATE tabl_policycontrol SET ConvertedDate = ? WHERE PolicyNumber = ? AND ConvertedDate is NULL"

//query to set of policy number and corresponding payload to be retrieved into pc for conversion
public static final var querySelectPolicyPayloadToConvert : String = "Select PolicyNumber, Payload FROM dbo.tabl_policystaging WHERE Completed <> 1 AND ErrorReason IS NULL"

 //after success conversion , update the staging table for success
public static final var queryUpdatePolicyPayloadConverted: String = "UPDATE tabl_policystaging SET Completed = 1, ErrorReason = ? WHERE PolicyNumber = ? AND Completed = 0"

//query to get count for accountNumber Exists or not in staging table
public static final var querySelectPolicyExistsOrNotInStaging : String = "Select PolicyNumber FROM  tabl_policystaging WHERE PolicytNumber = ?"

 //query to update accountnumber is already exists in staging table
public static final var queryUpdatePolIsAlreadyExists : String = "UPDATE tabl_policystaging SET  ErrorReason = ? WHERE PolicyNumber = ? "

public static final var querySelectPolicyPayloadToCheckInStaging: String = "Select PolicyNumber, Payload FROM tabl_policystaging WHERE PolicyNumber = ? AND Completed <> 1 AND ErrorReason IS NULL"

 //query to get the count for account number exists or not in staging table
public static final var querySelectPolExistsOrNotInStaging : String = "Select PolicyNumber FROM  tabl_policystaging WHERE PolicyNumber = ? AND  Completed = 1"

  //2 query for update if account is already exists
public static final var queryUpdateDmWcPayloadExists: String = "UPDATE DmWcPayload SET status='ERROR',error_message='Existing Account' WHERE id = ?"

  //3 After success conversion , update the staging table for
public static final var queryUpdateDmWcPayloadConverted: String = "UPDATE DmWcPayload SET status='SUCCESS' WHERE id = ?"

  //1 query to get set of account number and corresponding payload to be retrieved into pc for conversion
public static final var querySelectDmWcPayloadToConvert : String = "SELECT id,payload FROM DmWcPayload WHERE status IS NULL"



}