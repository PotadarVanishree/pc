package gw.webservice.SuspectWebServices

uses gw.xml.ws.annotation.WsiExportable

@WsiExportable
class Suspect {
  var name : String
  var age : int
  var profession : String
      construct(nam : String,age_ : int,profession_ : String){
        this.name = name
        this.age = age
        this.profession = profession
      }
}