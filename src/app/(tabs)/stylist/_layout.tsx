import { Stack } from 'expo-router';

export default function StylistLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Stylist'
                }}
            />
            <Stack.Screen
                name="upload"
                options={{
                    headerShown: false,
                    title: 'Upload'
                }}
            />
            <Stack.Screen
                name="styleSelection"
                options={{
                    headerShown: false,
                    title: 'Style Selection'
                }}
            />
            <Stack.Screen
                name="outfitDisplay"
                options={{
                    headerShown: false,
                    title: 'Outfit Display'
                }}
            />
        </Stack>
    );
}