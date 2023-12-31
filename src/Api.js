import axios, * as others from "axios";
const url = "http://localhost:15527/";

const Request = async (query) => {
  const option = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      // 'data' for POST request body
      query: query,
    },
  };

  return axios
    .request(option)
    .then((res) => {
      console.log(res);
      return res.data; // The response data
    })
    .catch((err) => {
      console.error(err);
    });
};

export default Request;
