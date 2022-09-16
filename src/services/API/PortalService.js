import axios from 'axios';

export default {
    productRegistration,
    serialNumberValidation,
};

async function serialNumberValidation(serial) {
    try {
        const response = await axios.request({
            method: 'GET',
            url: `https://io.rinnai.us/api/v1/product/check-serial/${serial}`,
            headers: {Authorization: 'Bearer k@K8p!pdbL0djguS'},
        });
        return response.data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function productRegistration(params) {
    const options = {
        method: 'POST',
        url: 'https://io.rinnai.us/api/v1/wwith/object',
        headers: {Authorization: 'Bearer k@K8p!pdbL0djguS', 'Content-Type': 'application/json'},
        data: {
            input: {
                _fields: {
                    name: `${params.thingName} (${params.serial})`,
                    type: 'registration',
                    status: '1',
                },
                _props: {
                    serial: params.serial,
                    model: params.model,
                    gateway_dsn: 'xxxxxx',
                    application_type: params.application_type,
                    recirculation_type: params.recirculation_type,
                    install_datetime: params.install_datetime,
                    future_emails: '1',
                    share_my_data: '1',
                    registration_type: params.registration_type,
                    gas: 'gas',
                    customer: {
                        first_name: params.first_name,
                        last_name: params.last_name,
                        phone: params.phone,
                        email: params.email,
                        address: {
                            country: params.country,
                            state: params.state,
                            city: params.city,
                            postal: params.postal,
                            address: params.address,
                        },
                    },
                },
            },
        },
    };
    try {
        const res = await axios.request(options);
        return res.data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}
