package gw.webservice.ImplWebservice
uses gw.xml.ws.annotation.WsiExportable
uses java.util.Date
uses java.lang.Integer

@WsiExportable
final class PublicIdExists {

    var _publicId  : String as PublicId
    var _year  : String as Year

  }