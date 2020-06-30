package com.afcdp.database

uses java.sql.Connection
uses java.sql.DriverManager

/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 5/26/20
 * Time: 2:11 PM
 * To change this template use File | Settings | File Templates.
 */
class AFCConnectionManager {
   static  function createLegacyDBConnection(): Connection {
     // connection to legacy DB to query legacy data
       return DriverManager.getConnection ("jdbc:sqlserver://localhost:1433;databaseName=AK_LegacyDB;user=gwuser;password=pc")
   }
  static function createStagingDBConnection(): Connection{
    // connection to staging DB to access control and staging table
    return DriverManager.getConnection ("jdbc:sqlserver://localhost:1433;databaseName=AK_StagingDB;user=gwuser;password=pc")
  }

    static function createAccConversionDBConnection() : Connection{
      return DriverManager.getConnection("jdbc:sqlserver://localhost:1433; databaseName=ConversionControl;user=gwuser;password=pc")
       }
    }