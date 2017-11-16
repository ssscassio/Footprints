import { createRouter } from "@expo/ex-navigation";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

const Router = createRouter(() => ({
    home: () => HomeScreen,
    login: () => LoginScreen
}));

export default Router;
