import { createRouter } from "@expo/ex-navigation";

import HomeScreen from "./screens/HomeScreen";

const Router = createRouter(() => ({
    home: () => HomeScreen
}));

export default Router;
