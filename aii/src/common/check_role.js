// @ts-check
/**
 * 检查用户角色是否符合接口中的角色要求
 * @param {Object} userInfo 用户信息
 * @param {Object} apiInfo 接口信息
 * @returns {boolean}
 */
function check_role(userInfo, apiInfo) {
  if (!apiInfo) {
    return false;
  }

  if (apiInfo.requireRole[0] == "*") {
    return true;
  }

  if (apiInfo.requireRole[0] == "?") {
    return userInfo != null;
  }

  const userRoleType = userInfo.role_type;
  if (!userRoleType) {
    return false;
  }

  const apiRequireRoles = apiInfo.requireRole;  //当前api 要求的角色， 数组
  let userRoles = [];

  // 用户具有的角色，数组
  if (Array.isArray(userInfo.role_type)) {
    userRoles = userInfo.role_type;
  } else if (typeof userInfo.role_type === "string") {
    userRoles = userInfo.role_type.split(",").map(role => { return role.trim(); });
  } else {
    return false;
  }

  //判断两个数组有交集(用户有一个角色在接口要求角色中)， 返回true
  return userRoles.some(role => { return apiRequireRoles.includes(role); });
}

module.exports = check_role;
