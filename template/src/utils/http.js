import axios from 'axios';
// axios.defaults.baseURL = '';
axios.defaults.responseType = 'json';
axios.defaults.timeout = 100000;

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    let resData = response.data;
    // 这里写接口返回数据处理
    if (!resData) {
      return Promise.reject('数据格式不对', response);
    }
    return resData
  },
  function(error) {
    if (
      error.code === 'ECONNABORTED' &&
      error.message.indexOf('timeout') >= 0
    ) {
      return Promise.reject('请求超时');
    } else {
      return Promise.reject(error.message);
    }
  },
);

const get = (url, params) => {
  return axios({
    method: 'get',
    withCredentials: true,
    url,
    params,
    data: undefined,
  });
};

const post = (url, data) => {
  return axios({
    method: 'post',
    withCredentials: true,
    url,
    params: undefined,
    data,
  });
};
export { get, post };
export default { get, post };
