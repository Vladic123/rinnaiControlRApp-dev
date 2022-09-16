import AsyncStorage from '@react-native-community/async-storage';

module.exports = {
    storeMigrationData,
    getMigrationData,
    deleteMigrationData,
};

const _migrationDataKeyName = '@migrationData';
async function getMigrationData() {
    try {
        const value = await AsyncStorage.getItem(_migrationDataKeyName);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.log('cannot retrieve' + _migrationDataKeyName);
    }
}

async function storeMigrationData(data) {
    await AsyncStorage.setItem(_migrationDataKeyName, JSON.stringify(data));
}

async function deleteMigrationData() {
    await AsyncStorage.removeItem(_migrationDataKeyName);
}
