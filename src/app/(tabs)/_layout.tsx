import { Tabs, Redirect } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: '#181819',
                        height: 60,
                        borderColor: '#181819'
                    },
                    tabBarActiveTintColor: '#B5FED9',
                    tabBarInactiveTintColor: '#F8E9D5',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },

                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon
                                icon="home"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="stylist"
                    options={{
                        title: "Stylist",
                        headerShown: false,
                        tabBarLabel: 'Stylist',
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon
                                icon="compass-drafting"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="wardrobe"
                    options={{
                        title: "Wardrobe",
                        headerShown: false,
                        tabBarLabel: 'Wardrobe',
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon
                                icon="tshirt"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon
                                icon="user"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout;
