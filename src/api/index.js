const ApiClient = async (url, method, headers, bodyConfig) => {
  const res = await fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(bodyConfig),
  });

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Something went wrong");
  }
};

export default ApiClient;
