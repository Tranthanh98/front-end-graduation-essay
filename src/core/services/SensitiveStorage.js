
const storage = window.sessionStorage

/**
 * SensitiveStorage class
 *
 * @description
 */
class SensitiveStorage {

  getUserId() {
    return storage.getItem("user_id");
  }

  setUserId(token) {
    storage.setItem("user_id", token);
  }

  removeUserId() {
    storage.removeItem("user_id");
  }

  getToken() {
    return storage.getItem("TOKEN");
  }

  setToken(token){
    storage.setItem("TOKEN", token);
  }

  removeToken() {
    storage.removeItem("TOKEN");
  }
  
  getTrainingId() {
    return storage.getItem("id");
  }

  setTrainingId(id) {
    storage.setItem("id", id);
  }

  removeTrainingId() {
    storage.removeItem("id");
  }
  setUserName(userName){
    storage.setItem("USERNAME", userName);
  }
  getUsername(){
    return storage.getItem("USERNAME");
  }
  removeUserName(){
    storage.removeItem("USERNAME");
  }
  setClassRoom(classRoom){
    storage.setItem("CLASS", classRoom);
  }
  getClassRoom(){
    return storage.getItem("CLASS");
  }
  removeClassRoom(){
    storage.removeItem("CLASS");
  }
}
export const sensitiveStorage = new SensitiveStorage();

export default SensitiveStorage;
