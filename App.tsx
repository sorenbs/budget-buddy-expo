import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import { PrismaProvider } from "./prismaProvider";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <PrismaProvider databaseName="db">
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: "Budget Buddy",
              headerLargeTitle: true,
            }}
          />
        </Stack.Navigator>
      </PrismaProvider>
    </NavigationContainer>
  );
}
