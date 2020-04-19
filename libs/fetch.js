import fetch from "isomorphic-unfetch";
import Router from "next/router";

const URL = "https://passwall-api.herokuapp.com";
const DEV_URL = "http://localhost:3625";

export default async function (path, options, json = true) {
  const res = await fetch(`${DEV_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    ...options,
  });
  if (res.status == 401) Router.push("/login");

  return json ? res.json() : res;
}
