import { createRouter } from "@expo/ex-navigation";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AddFriendScreen from "./screens/AddFriendScreen";

const Router = createRouter(() => ({
    home: () => HomeScreen,
    login: () => LoginScreen,
    addFriend: () => AddFriendScreen,
}));

export default Router;
