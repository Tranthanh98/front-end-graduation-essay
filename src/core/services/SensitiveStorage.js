
const storage = window.sessionStorage

/**
 * SensitiveStorage class
 *
 * @description
 */
class SensitiveStorage {
  //User id
  setUserId(id) {
    storage.setItem("user_id", `${id}`);
  }

  getUserId() {
    return parseInt(storage.getItem("user_id"));
  }

  setStudentId(id) {
    storage.setItem("student_id", `${id}`);
  }

  getStudentId() {
    return parseInt(storage.getItem("student_id"));
  }

  setTeacherId(id) {
    storage.setItem("teacher_id", `${id}`);
  }

  getTeacherId() {
    return parseInt(storage.getItem("teacher_id"));
  }

  removeUserId() {
    storage.removeItem("user_id");
  }
  //User role
  setUserRole(role) {
    storage.setItem("USER_ROLE", `${role}`);
  }

  getUserRole() {
    return parseInt(storage.getItem("USER_ROLE"));
  }

  removeUserRole() {
    storage.removeItem("USER_ROLE");
  }

  getToken() {
    return storage.getItem("TOKEN");
  }

  setToken(token) {
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
  setUserName(userName) {
    storage.setItem("USERNAME", userName);
  }
  getUsername() {
    return storage.getItem("USERNAME");
  }
  removeUserName() {
    storage.removeItem("USERNAME");
  }
  setClassRoom(classRoom) {
    storage.setItem("CLASS", classRoom);
  }
  getClassRoom() {
    return storage.getItem("CLASS");
  }
  removeClassRoom() {
    storage.removeItem("CLASS");
  }
}
export const sensitiveStorage = new SensitiveStorage();

export default SensitiveStorage;
