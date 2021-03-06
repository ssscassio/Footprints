import { createRouter } from "@expo/ex-navigation";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import FriendScreen from "./screens/FriendScreen";
import AddFriendScreen from "./screens/AddFriendScreen";
import { CreateGroupScreen, GroupNameScreen, GroupScreen } from "./screens/CreateGroupScreen";

const Router = createRouter(() => ({
    home: () => HomeScreen,
    login: () => LoginScreen,
    addFriend: () => AddFriendScreen,
    createGroup: () => CreateGroupScreen,
    groupName: () => GroupNameScreen,
    group: () => GroupScreen,
    friend: () => FriendScreen
}));

export default Router;
