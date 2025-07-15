import { authStore } from "../store/authStore"
export const checkAv = (id) => {
    const onlineUser = authStore.getState().onlineUser;
    // if (onlineUser.lenght == 0) {
    //     return "hidden";
    // }
    if (onlineUser.includes(id)) {
        return "avatar-online"
    } else {
        return "avatar-offline ";
    }
}