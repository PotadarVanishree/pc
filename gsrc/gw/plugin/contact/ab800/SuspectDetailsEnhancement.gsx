package gw.plugin.contact.ab800
/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 4/15/20
 * Time: 6:11 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement SuspectDetailsEnhancement : entity.suspectDetails_Ext {
                       property get fullName():String{
                         if(this.SuspectFirstName==null or this.SuspectLastName==null) {
                           this.SuspectFirstName=""
                           this.SuspectLastName=""
                           return this.SuspectFirstName+""+this.SuspectLastName
                         } else
                         return this.SuspectFirstName+""+this.SuspectLastName
                         }

}
