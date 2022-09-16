export const updateDevice = /* GraphQL */ `
    mutation UpdateDevice($input: UpdateDeviceInput!, $condition: ModelDeviceConditionInput) {
        updateDevice(input: $input, condition: $condition) {
            id
            thing_name
            device_name
            dealer_uuid
            city
            state
            street
            zip
            country
            firmware
            model
            dsn
            user_uuid
            connected_at
            key
            lat
            lng
            address
        }
    }
`;

export const updateDeviceDealer = /* GraphQL */ `
    mutation UpdateDevice($input: UpdateDeviceInput!, $condition: ModelDeviceConditionInput) {
        updateDevice(input: $input, condition: $condition) {
            id
            dealer_uuid
        }
    }
`;

export const updateVacationMode = /* GraphQL */ `
    mutation UpdateDevice($input: UpdateDeviceInput!, $condition: ModelDeviceConditionInput) {
        updateDevice(input: $input, condition: $condition) {
            id
            vacation
        }
    }
`;
