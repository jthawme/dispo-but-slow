import qs from "querystring";

const endpoint = `https://dk7pwacyj9.execute-api.us-east-1.amazonaws.com/dev`;

const postRoute = (route, data = {}) => {
  return fetch(`${endpoint}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
};

const getRoute = (route, data = {}) => {
  return fetch(`${endpoint}${route}?${qs.stringify(data)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
};

export const api = {
  token: {
    get(data) {
      return postRoute("/token", {
        data,
      });
    },
  },
  uploads: {
    getUrls(names: string[]) {
      return postRoute(`/get-urls`, {
        names: names.join(","),
      });
    },
    saveData(email: string, names: string[]) {
      return postRoute("/save", {
        email,
        names: names.join(","),
      });
    },
  },
  photos: {
    get(id) {
      return getRoute("/photos", {
        id,
      });
    },
  },
};
