import api, { SERVER_HOST } from "./api";

export const login = (username, password) =>
    api.post(
        `${SERVER_HOST}/login`,
        { username, password },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

export const userInfo = () => api.get(`${SERVER_HOST}/user`);

export const authInfo = () => api.get(`${SERVER_HOST}/auth`);

export const join = (data) => api.post(`${SERVER_HOST}/user/join`, data);
