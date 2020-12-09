let Session = {};

Session.get = function (key) {
  let value = sessionStorage.getItem(key);
  let data;

  if (typeof value === 'string') {
    try {
      data = JSON.parse(value);
    } catch (e) {
      data = value;
    }
  } else {
    data = value;
  }

  return data;
};

Session.set = function (key, value) {
  if (typeof value === 'object') {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.setItem(key, value);
  }
};

Session.remove = function (key) {
  sessionStorage.removeItem(key);
};

export default Session;
