/**
 * @author Wuner
 * @date 2020/12/8 9:56
 * @description
 */
let CommonUtils = {};
CommonUtils.isIos = function () {
  let isIos = navigator.userAgent.match(/(iPhone|iPad|iOS)/i) != null;
  return isIos ? isIos : false;
};

CommonUtils.isAndroid = function () {
  let isAndroid = false;
  isAndroid = navigator.userAgent.match(/(Android)/i) != null;
  return isAndroid;
};
export default CommonUtils
