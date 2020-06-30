package gw.webservice.SuspectWebServices

uses gw.xml.ws.annotation.WsiWebService
/*
This class should be highlighting the functions for retrieving suspect details
* */

@WsiWebService
 class SuspectDetails {
      function getSuspectName():String{
        return "Dummy Suspect"
      }
  function suspectPastHistoryCount():int{
    return 1234
  }
  function returnSuspectObject():Suspect{

    return new Suspect("name",12,"profession")
  }
}