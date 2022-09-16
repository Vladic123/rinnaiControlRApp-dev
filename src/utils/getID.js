import {Platform} from 'react-native';

export default function getID(id) {
    if (!id) {
        return {};
    }

    return Platform.select({
        android: {testID: id, accessibilityLabel: id},
        ios: {testID: id},
    });
}
