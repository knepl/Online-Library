import { atom } from "recoil";

const authState = atom({
    key: "auth",
    default: {
        auth: !!localStorage.getItem("token"),
    },
});

export { authState };
