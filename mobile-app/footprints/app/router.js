import { createRouter } from "@expo/ex-navigation";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AddFriendScreen from "./screens/AddFriendScreen";
import { CreateGroupScreen, GroupNameScreen } from "./screens/CreateGroupScreen";

const Router = createRouter(() => ({
    home: () => HomeScreen,
    login: () => LoginScreen,
    addFriend: () => AddFriendScreen,
    createGroup: () => CreateGroupScreen,
    groupName: () => GroupNameScreen,
}));

export default Router;
