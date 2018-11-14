export let checkRoleName = (rule, value, callback) => {
  if (value !== '') {
    let reg = /^[\u4e00-\u9faf]+$/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error('角色名称只能为汉字'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入角色名称'));
  }
};
