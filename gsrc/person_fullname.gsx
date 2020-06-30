/**
 * Created with IntelliJ IDEA.
 * User: AFC7
 * Date: 3/13/20
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement person_fullname : entity.Account {
  property get fullname():String   {
    if (this.firstname==null&&this.lastname==null){
      return null
    }
    return this.firstname+""+this.lastname
  }

}
