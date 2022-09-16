// this is an auto generated file. This will be overwritten

export const getRinnaiDealer = /* GraphQL */ `
    query GetRinnaiDealer($id: ID!) {
        getRinnaiDealer(id: $id) {
            id
            name
            email
            approved
            confirmed
            aws_confirm
            country
            city
            state
            street
            zip
            company
            username
            firstname
            lastname
            phone_country_code
            phone
            primary_contact
            terms_accepted
            terms_accepted_at
            terms_email_sent_at
            terms_token
            roles
            createdAt
            updatedAt
        }
    }
`;
export const listRinnaiDealers = /* GraphQL */ `
    query ListRinnaiDealers($id: ID, $filter: ModelRinnaiDealerFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listRinnaiDealers(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                name
                email
                approved
                confirmed
                aws_confirm
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const listRinnaiUsers = /* GraphQL */ `
    query ListRinnaiUsers($id: ID, $filter: ModelRinnaiUserFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listRinnaiUsers(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getRinnaiUser = /* GraphQL */ `
    query GetRinnaiUser($id: ID!) {
        getRinnaiUser(id: $id) {
            id
            name
            email
            admin
            approved
            confirmed
            aws_confirm
            imported
            country
            city
            state
            street
            zip
            company
            username
            firstname
            lastname
            st_accesstoken
            st_refreshtoken
            callbackurl_oauthtoken
            callbackurl_statecallback
            phone_country_code
            phone
            primary_contact
            terms_accepted
            terms_accepted_at
            terms_email_sent_at
            terms_token
            roles
            createdAt
            updatedAt
            devices {
                nextToken
            }
        }
    }
`;
export const getUserByEmail = /* GraphQL */ `
    query GetUserByEmail($email: String, $sortDirection: ModelSortDirection, $filter: ModelRinnaiUserFilterInput, $limit: Int, $nextToken: String) {
        getUserByEmail(email: $email, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const userByCompany = /* GraphQL */ `
    query UserByCompany($company: String, $sortDirection: ModelSortDirection, $filter: ModelRinnaiUserFilterInput, $limit: Int, $nextToken: String) {
        userByCompany(company: $company, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchRinnaiUsers = /* GraphQL */ `
    query SearchRinnaiUsers($filter: SearchableRinnaiUserFilterInput, $sort: SearchableRinnaiUserSortInput, $limit: Int, $nextToken: String) {
        searchRinnaiUsers(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const getDealerCustomers = /* GraphQL */ `
    query GetDealerCustomers($dealer_uuid: ID!) {
        getDealerCustomers(dealer_uuid: $dealer_uuid) {
            dealer_uuid
            user_uuid
            createdAt
            updatedAt
            monitoring {
                nextToken
            }
        }
    }
`;
export const listDealerCustomerss = /* GraphQL */ `
    query ListDealerCustomerss(
        $dealer_uuid: ID
        $filter: ModelDealerCustomersFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDealerCustomerss(dealer_uuid: $dealer_uuid, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                dealer_uuid
                user_uuid
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const listDealerMonitorings = /* GraphQL */ `
    query ListDealerMonitorings(
        $serial_id: ID
        $filter: ModelDealerMonitoringFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDealerMonitorings(serial_id: $serial_id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                serial_id
                dealer_uuid
                user_uuid
                request_state
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDealerMonitoring = /* GraphQL */ `
    query GetDealerMonitoring($serial_id: ID!) {
        getDealerMonitoring(serial_id: $serial_id) {
            serial_id
            dealer_uuid
            user_uuid
            request_state
            createdAt
            updatedAt
            dealer {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            customer {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            device {
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
                vacation
                createdAt
                updatedAt
            }
        }
    }
`;
export const monitorByDealer = /* GraphQL */ `
    query MonitorByDealer(
        $dealer_uuid: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDealerMonitoringFilterInput
        $limit: Int
        $nextToken: String
    ) {
        monitorByDealer(dealer_uuid: $dealer_uuid, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                serial_id
                dealer_uuid
                user_uuid
                request_state
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const listDevices = /* GraphQL */ `
    query ListDevices($id: ID, $filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listDevices(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
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
                vacation
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDevice = /* GraphQL */ `
    query GetDevice($id: ID!) {
        getDevice(id: $id) {
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
            vacation
            createdAt
            updatedAt
            user {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
            monitoring {
                serial_id
                dealer_uuid
                user_uuid
                request_state
                createdAt
                updatedAt
            }
            activity {
                clientId
                serial_id
                timestamp
                eventType
                clientInitiatedDisconnect
                sessionIdentifier
                principalIdentifier
                disconnectReason
                ipAddress
                versionNumber
                topics
                createdAt
                updatedAt
            }
            schedule {
                nextToken
            }
            info {
                serial_id
                ayla_dsn
                name
                baton_info
                exception
                domestic_combustion
                domestic_temperature
                wifi_ssid
                wifi_signal_strength
                wifi_channel_frequency
                local_ip
                public_ip
                ap_mac_addr
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                type
                unix_time
                m01_water_flow_rate_raw
                do_maintenance_retrieval
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                firmware_version
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                error_code
                warning_code
                internal_temperature
                tot_wrm
                unknown_b
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                oem_host_version
                schedule_a_name
                zigbee_pairing_count
                schedule_c_name
                schedule_b_name
                model
                schedule_d_name
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            errorLogs {
                nextToken
            }
            shadow {
                heater_serial_number
                ayla_dsn
                rinnai_registered
                do_maintenance_retrieval
                model
                dsn
                module_log_level
                set_priority_status
                set_priority
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                timezone
                timezone_encoded
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                recirculation_not_configured
                maximum_domestic_temperature
                minimum_domestic_temperature
                baton_shadow
                createdAt
                updatedAt
            }
            registration {
                nextToken
            }
        }
    }
`;
export const deviceByUser = /* GraphQL */ `
    query DeviceByUser($user_uuid: ID, $sortDirection: ModelSortDirection, $filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String) {
        deviceByUser(user_uuid: $user_uuid, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
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
                vacation
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const deviceByDsn = /* GraphQL */ `
    query DeviceByDsn($dsn: String, $sortDirection: ModelSortDirection, $filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String) {
        deviceByDSN(dsn: $dsn, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
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
                vacation
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const deviceByDealer = /* GraphQL */ `
    query DeviceByDealer($dealer_uuid: String, $sortDirection: ModelSortDirection, $filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String) {
        deviceByDealer(dealer_uuid: $dealer_uuid, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
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
                vacation
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchDevices = /* GraphQL */ `
    query SearchDevices($filter: SearchableDeviceFilterInput, $sort: SearchableDeviceSortInput, $limit: Int, $nextToken: String) {
        searchDevices(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
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
                vacation
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const getDeviceMonitor = /* GraphQL */ `
    query GetDeviceMonitor($id: ID!) {
        getDeviceMonitor(id: $id) {
            id
            ayla_dsn
            serial_number
            user
            firmware
            recirculation
            schedule
            connected
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceMonitors = /* GraphQL */ `
    query ListDeviceMonitors($id: ID, $filter: ModelDeviceMonitorFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listDeviceMonitors(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                ayla_dsn
                serial_number
                user
                firmware
                recirculation
                schedule
                connected
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const monitorByUser = /* GraphQL */ `
    query MonitorByUser(
        $user_uuid: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDealerMonitoringFilterInput
        $limit: Int
        $nextToken: String
    ) {
        monitorByUser(user_uuid: $user_uuid, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                serial_id
                dealer_uuid
                user_uuid
                request_state
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const monitorByDsn = /* GraphQL */ `
    query MonitorByDsn(
        $ayla_dsn: String
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceMonitorFilterInput
        $limit: Int
        $nextToken: String
    ) {
        monitorByDSN(ayla_dsn: $ayla_dsn, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                ayla_dsn
                serial_number
                user
                firmware
                recirculation
                schedule
                connected
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchDeviceMonitors = /* GraphQL */ `
    query SearchDeviceMonitors(
        $filter: SearchableDeviceMonitorFilterInput
        $sort: SearchableDeviceMonitorSortInput
        $limit: Int
        $nextToken: String
    ) {
        searchDeviceMonitors(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
                id
                ayla_dsn
                serial_number
                user
                firmware
                recirculation
                schedule
                connected
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const listDeviceActivitys = /* GraphQL */ `
    query ListDeviceActivitys(
        $clientId: String
        $filter: ModelDeviceActivityFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceActivitys(clientId: $clientId, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                clientId
                serial_id
                timestamp
                eventType
                clientInitiatedDisconnect
                sessionIdentifier
                principalIdentifier
                disconnectReason
                ipAddress
                versionNumber
                topics
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDeviceActivity = /* GraphQL */ `
    query GetDeviceActivity($clientId: String!) {
        getDeviceActivity(clientId: $clientId) {
            clientId
            serial_id
            timestamp
            eventType
            clientInitiatedDisconnect
            sessionIdentifier
            principalIdentifier
            disconnectReason
            ipAddress
            versionNumber
            topics
            createdAt
            updatedAt
        }
    }
`;
export const activityByDevice = /* GraphQL */ `
    query ActivityByDevice(
        $serial_id: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceActivityFilterInput
        $limit: Int
        $nextToken: String
    ) {
        activityByDevice(serial_id: $serial_id, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                clientId
                serial_id
                timestamp
                eventType
                clientInitiatedDisconnect
                sessionIdentifier
                principalIdentifier
                disconnectReason
                ipAddress
                versionNumber
                topics
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDeviceSchedule = /* GraphQL */ `
    query GetDeviceSchedule($id: ID!) {
        getDeviceSchedule(id: $id) {
            id
            serial_id
            name
            schedule
            days
            times
            schedule_date
            active
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceSchedules = /* GraphQL */ `
    query ListDeviceSchedules($id: ID, $filter: ModelDeviceScheduleFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listDeviceSchedules(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                serial_id
                name
                schedule
                days
                times
                schedule_date
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const scheduleByDevice = /* GraphQL */ `
    query ScheduleByDevice(
        $serial_id: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceScheduleFilterInput
        $limit: Int
        $nextToken: String
    ) {
        scheduleByDevice(serial_id: $serial_id, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                serial_id
                name
                schedule
                days
                times
                schedule_date
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const deviceBySchedule = /* GraphQL */ `
    query DeviceBySchedule(
        $serial_id: ID
        $schedule: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceScheduleFilterInput
        $limit: Int
        $nextToken: String
    ) {
        deviceBySchedule(
            serial_id: $serial_id
            schedule: $schedule
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                serial_id
                name
                schedule
                days
                times
                schedule_date
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const listDeviceInfos = /* GraphQL */ `
    query ListDeviceInfos($serial_id: ID, $filter: ModelDeviceInfoFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listDeviceInfos(serial_id: $serial_id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                serial_id
                ayla_dsn
                name
                baton_info
                exception
                domestic_combustion
                domestic_temperature
                wifi_ssid
                wifi_signal_strength
                wifi_channel_frequency
                local_ip
                public_ip
                ap_mac_addr
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                type
                unix_time
                m01_water_flow_rate_raw
                do_maintenance_retrieval
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                firmware_version
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                error_code
                warning_code
                internal_temperature
                tot_wrm
                unknown_b
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                oem_host_version
                schedule_a_name
                zigbee_pairing_count
                schedule_c_name
                schedule_b_name
                model
                schedule_d_name
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDeviceInfo = /* GraphQL */ `
    query GetDeviceInfo($serial_id: ID!) {
        getDeviceInfo(serial_id: $serial_id) {
            serial_id
            ayla_dsn
            name
            baton_info
            exception
            domestic_combustion
            domestic_temperature
            wifi_ssid
            wifi_signal_strength
            wifi_channel_frequency
            local_ip
            public_ip
            ap_mac_addr
            recirculation_temperature
            recirculation_duration
            zigbee_inventory
            zigbee_status
            lime_scale_error
            mc__total_calories
            type
            unix_time
            m01_water_flow_rate_raw
            do_maintenance_retrieval
            aft_tml
            tot_cli
            unt_mmp
            aft_tmh
            bod_tmp
            m09_fan_current
            m02_outlet_temperature
            firmware_version
            bur_thm
            tot_clm
            exh_tmp
            m05_fan_frequency
            m10_total_bath_fill_volume
            m06_other_system_controllers
            thermal_fuse_temperature
            m04_combustion_cycles
            hardware_version
            m11_heat_exchanger_outlet_temperature
            bur_tmp
            tot_wrl
            m12_bypass_servo_position
            m08_inlet_temperature
            m20_pump_cycles
            module_firmware_version
            error_code
            warning_code
            internal_temperature
            tot_wrm
            unknown_b
            rem_idn
            m07_water_flow_control_position
            m03_combustion_hours_raw
            m15_indoor_antifreeze_temperature
            operation_hours
            device_boot
            thermocouple
            tot_wrh
            recirculation_capable
            maintenance_list
            tot_clh
            temperature_table
            m19_pump_hours
            oem_host_version
            schedule_a_name
            zigbee_pairing_count
            schedule_c_name
            schedule_b_name
            model
            schedule_d_name
            total_bath_fill_volume
            dt
            createdAt
            updatedAt
        }
    }
`;
export const getDeviceAylaDsn = /* GraphQL */ `
    query GetDeviceAylaDsn(
        $ayla_dsn: String
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceInfoFilterInput
        $limit: Int
        $nextToken: String
    ) {
        getDeviceAylaDSN(ayla_dsn: $ayla_dsn, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                serial_id
                ayla_dsn
                name
                baton_info
                exception
                domestic_combustion
                domestic_temperature
                wifi_ssid
                wifi_signal_strength
                wifi_channel_frequency
                local_ip
                public_ip
                ap_mac_addr
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                type
                unix_time
                m01_water_flow_rate_raw
                do_maintenance_retrieval
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                firmware_version
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                error_code
                warning_code
                internal_temperature
                tot_wrm
                unknown_b
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                oem_host_version
                schedule_a_name
                zigbee_pairing_count
                schedule_c_name
                schedule_b_name
                model
                schedule_d_name
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const deviceInfoByTime = /* GraphQL */ `
    query DeviceInfoByTime(
        $unix_time: String
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceInfoFilterInput
        $limit: Int
        $nextToken: String
    ) {
        deviceInfoByTime(unix_time: $unix_time, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                serial_id
                ayla_dsn
                name
                baton_info
                exception
                domestic_combustion
                domestic_temperature
                wifi_ssid
                wifi_signal_strength
                wifi_channel_frequency
                local_ip
                public_ip
                ap_mac_addr
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                type
                unix_time
                m01_water_flow_rate_raw
                do_maintenance_retrieval
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                firmware_version
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                error_code
                warning_code
                internal_temperature
                tot_wrm
                unknown_b
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                oem_host_version
                schedule_a_name
                zigbee_pairing_count
                schedule_c_name
                schedule_b_name
                model
                schedule_d_name
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDeviceErrorHistory = /* GraphQL */ `
    query GetDeviceErrorHistory($id: ID!) {
        getDeviceErrorHistory(id: $id) {
            id
            serial_id
            dealer_id
            user_id
            ayla_dsn
            name
            lime_scale_error
            m01_water_flow_rate_raw
            m02_outlet_temperature
            m04_combustion_cycles
            m08_inlet_temperature
            error_code
            warning_code
            operation_hours
            active
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceErrorHistorys = /* GraphQL */ `
    query ListDeviceErrorHistorys(
        $id: ID
        $filter: ModelDeviceErrorHistoryFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceErrorHistorys(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                serial_id
                dealer_id
                user_id
                ayla_dsn
                name
                lime_scale_error
                m01_water_flow_rate_raw
                m02_outlet_temperature
                m04_combustion_cycles
                m08_inlet_temperature
                error_code
                warning_code
                operation_hours
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const logsByDevice = /* GraphQL */ `
    query LogsByDevice(
        $serial_id: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceErrorHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        logsByDevice(serial_id: $serial_id, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                serial_id
                dealer_id
                user_id
                ayla_dsn
                name
                lime_scale_error
                m01_water_flow_rate_raw
                m02_outlet_temperature
                m04_combustion_cycles
                m08_inlet_temperature
                error_code
                warning_code
                operation_hours
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const errorByDate = /* GraphQL */ `
    query ErrorByDate(
        $serial_id: ID
        $createdAt: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceErrorHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        errorByDate(
            serial_id: $serial_id
            createdAt: $createdAt
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                serial_id
                dealer_id
                user_id
                ayla_dsn
                name
                lime_scale_error
                m01_water_flow_rate_raw
                m02_outlet_temperature
                m04_combustion_cycles
                m08_inlet_temperature
                error_code
                warning_code
                operation_hours
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getErrorCodes = /* GraphQL */ `
    query GetErrorCodes($id: ID!) {
        getErrorCodes(id: $id) {
            id
            error_code
            type
            message
            createdAt
            updatedAt
        }
    }
`;
export const listErrorCodess = /* GraphQL */ `
    query ListErrorCodess($id: ID, $filter: ModelErrorCodesFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listErrorCodess(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                error_code
                type
                message
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const errorByCode = /* GraphQL */ `
    query ErrorByCode($error_code: ID, $sortDirection: ModelSortDirection, $filter: ModelErrorCodesFilterInput, $limit: Int, $nextToken: String) {
        errorByCode(error_code: $error_code, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                error_code
                type
                message
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const listDeviceShadows = /* GraphQL */ `
    query ListDeviceShadows(
        $heater_serial_number: ID
        $filter: ModelDeviceShadowFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceShadows(
            heater_serial_number: $heater_serial_number
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                heater_serial_number
                ayla_dsn
                rinnai_registered
                do_maintenance_retrieval
                model
                dsn
                module_log_level
                set_priority_status
                set_priority
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                timezone
                timezone_encoded
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                recirculation_not_configured
                maximum_domestic_temperature
                minimum_domestic_temperature
                baton_shadow
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const getDeviceShadow = /* GraphQL */ `
    query GetDeviceShadow($heater_serial_number: ID!) {
        getDeviceShadow(heater_serial_number: $heater_serial_number) {
            heater_serial_number
            ayla_dsn
            rinnai_registered
            do_maintenance_retrieval
            model
            dsn
            module_log_level
            set_priority_status
            set_priority
            set_recirculation_enable
            set_recirculation_enabled
            set_domestic_temperature
            set_operation_enabled
            schedule
            schedule_holiday
            schedule_enabled
            do_zigbee
            timezone
            timezone_encoded
            priority_status
            recirculation_enabled
            recirculation_duration
            lock_enabled
            operation_enabled
            module_firmware_version
            recirculation_not_configured
            maximum_domestic_temperature
            minimum_domestic_temperature
            baton_shadow
            createdAt
            updatedAt
        }
    }
`;
export const getDeviceShadowHistory = /* GraphQL */ `
    query GetDeviceShadowHistory($id: ID!) {
        getDeviceShadowHistory(id: $id) {
            id
            heater_serial_number
            set_priority_status
            set_recirculation_enable
            set_recirculation_enabled
            set_domestic_temperature
            set_operation_enabled
            schedule
            schedule_holiday
            schedule_enabled
            do_zigbee
            priority_status
            recirculation_enabled
            recirculation_duration
            lock_enabled
            operation_enabled
            module_firmware_version
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceShadowHistorys = /* GraphQL */ `
    query ListDeviceShadowHistorys(
        $id: ID
        $filter: ModelDeviceShadowHistoryFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceShadowHistorys(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                heater_serial_number
                set_priority_status
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const shadowHistoryBySerial = /* GraphQL */ `
    query ShadowHistoryBySerial(
        $heater_serial_number: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceShadowHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        shadowHistoryBySerial(
            heater_serial_number: $heater_serial_number
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                heater_serial_number
                set_priority_status
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const shadowSearchBySerial = /* GraphQL */ `
    query ShadowSearchBySerial(
        $heater_serial_number: ID
        $createdAt: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceShadowHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        shadowSearchBySerial(
            heater_serial_number: $heater_serial_number
            createdAt: $createdAt
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                heater_serial_number
                set_priority_status
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchDeviceShadowHistorys = /* GraphQL */ `
    query SearchDeviceShadowHistorys(
        $filter: SearchableDeviceShadowHistoryFilterInput
        $sort: SearchableDeviceShadowHistorySortInput
        $limit: Int
        $nextToken: String
    ) {
        searchDeviceShadowHistorys(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
                id
                heater_serial_number
                set_priority_status
                set_recirculation_enable
                set_recirculation_enabled
                set_domestic_temperature
                set_operation_enabled
                schedule
                schedule_holiday
                schedule_enabled
                do_zigbee
                priority_status
                recirculation_enabled
                recirculation_duration
                lock_enabled
                operation_enabled
                module_firmware_version
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const getDeviceRecirculationHistory = /* GraphQL */ `
    query GetDeviceRecirculationHistory($id: ID!) {
        getDeviceRecirculationHistory(id: $id) {
            id
            heater_serial_number
            schedule
            schedule_enabled
            priority_status
            recirculation_enabled
            recirculation_duration
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceRecirculationHistorys = /* GraphQL */ `
    query ListDeviceRecirculationHistorys(
        $id: ID
        $filter: ModelDeviceRecirculationHistoryFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceRecirculationHistorys(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                heater_serial_number
                schedule
                schedule_enabled
                priority_status
                recirculation_enabled
                recirculation_duration
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const recircHistoryBySerial = /* GraphQL */ `
    query RecircHistoryBySerial(
        $heater_serial_number: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceRecirculationHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        recircHistoryBySerial(
            heater_serial_number: $heater_serial_number
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                heater_serial_number
                schedule
                schedule_enabled
                priority_status
                recirculation_enabled
                recirculation_duration
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const recircSearchBySerial = /* GraphQL */ `
    query RecircSearchBySerial(
        $heater_serial_number: ID
        $createdAt: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceRecirculationHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        recircSearchBySerial(
            heater_serial_number: $heater_serial_number
            createdAt: $createdAt
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                heater_serial_number
                schedule
                schedule_enabled
                priority_status
                recirculation_enabled
                recirculation_duration
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchDeviceRecirculationHistorys = /* GraphQL */ `
    query SearchDeviceRecirculationHistorys(
        $filter: SearchableDeviceRecirculationHistoryFilterInput
        $sort: SearchableDeviceRecirculationHistorySortInput
        $limit: Int
        $nextToken: String
    ) {
        searchDeviceRecirculationHistorys(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
                id
                heater_serial_number
                schedule
                schedule_enabled
                priority_status
                recirculation_enabled
                recirculation_duration
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const getDeviceInfoHistory = /* GraphQL */ `
    query GetDeviceInfoHistory($id: ID!) {
        getDeviceInfoHistory(id: $id) {
            id
            serial_id
            name
            domestic_combustion
            domestic_temperature
            recirculation_temperature
            recirculation_duration
            zigbee_inventory
            zigbee_status
            lime_scale_error
            mc__total_calories
            m01_water_flow_rate_raw
            aft_tml
            tot_cli
            unt_mmp
            aft_tmh
            bod_tmp
            m09_fan_current
            m02_outlet_temperature
            bur_thm
            tot_clm
            exh_tmp
            m05_fan_frequency
            m10_total_bath_fill_volume
            m06_other_system_controllers
            thermal_fuse_temperature
            m04_combustion_cycles
            hardware_version
            m11_heat_exchanger_outlet_temperature
            bur_tmp
            tot_wrl
            m12_bypass_servo_position
            m08_inlet_temperature
            m20_pump_cycles
            module_firmware_version
            internal_temperature
            tot_wrm
            rem_idn
            m07_water_flow_control_position
            m03_combustion_hours_raw
            m15_indoor_antifreeze_temperature
            operation_hours
            device_boot
            thermocouple
            tot_wrh
            recirculation_capable
            maintenance_list
            tot_clh
            temperature_table
            m19_pump_hours
            total_bath_fill_volume
            dt
            createdAt
            updatedAt
        }
    }
`;
export const listDeviceInfoHistorys = /* GraphQL */ `
    query ListDeviceInfoHistorys(
        $id: ID
        $filter: ModelDeviceInfoHistoryFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceInfoHistorys(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                id
                serial_id
                name
                domestic_combustion
                domestic_temperature
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                m01_water_flow_rate_raw
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                internal_temperature
                tot_wrm
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const infoHistoryBySerial = /* GraphQL */ `
    query InfoHistoryBySerial(
        $serial_id: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceInfoHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        infoHistoryBySerial(serial_id: $serial_id, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                serial_id
                name
                domestic_combustion
                domestic_temperature
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                m01_water_flow_rate_raw
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                internal_temperature
                tot_wrm
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const infoSearchBySerial = /* GraphQL */ `
    query InfoSearchBySerial(
        $serial_id: ID
        $createdAt: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceInfoHistoryFilterInput
        $limit: Int
        $nextToken: String
    ) {
        infoSearchBySerial(
            serial_id: $serial_id
            createdAt: $createdAt
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                serial_id
                name
                domestic_combustion
                domestic_temperature
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                m01_water_flow_rate_raw
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                internal_temperature
                tot_wrm
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const searchDeviceInfoHistorys = /* GraphQL */ `
    query SearchDeviceInfoHistorys(
        $filter: SearchableDeviceInfoHistoryFilterInput
        $sort: SearchableDeviceInfoHistorySortInput
        $limit: Int
        $nextToken: String
    ) {
        searchDeviceInfoHistorys(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
            items {
                id
                serial_id
                name
                domestic_combustion
                domestic_temperature
                recirculation_temperature
                recirculation_duration
                zigbee_inventory
                zigbee_status
                lime_scale_error
                mc__total_calories
                m01_water_flow_rate_raw
                aft_tml
                tot_cli
                unt_mmp
                aft_tmh
                bod_tmp
                m09_fan_current
                m02_outlet_temperature
                bur_thm
                tot_clm
                exh_tmp
                m05_fan_frequency
                m10_total_bath_fill_volume
                m06_other_system_controllers
                thermal_fuse_temperature
                m04_combustion_cycles
                hardware_version
                m11_heat_exchanger_outlet_temperature
                bur_tmp
                tot_wrl
                m12_bypass_servo_position
                m08_inlet_temperature
                m20_pump_cycles
                module_firmware_version
                internal_temperature
                tot_wrm
                rem_idn
                m07_water_flow_control_position
                m03_combustion_hours_raw
                m15_indoor_antifreeze_temperature
                operation_hours
                device_boot
                thermocouple
                tot_wrh
                recirculation_capable
                maintenance_list
                tot_clh
                temperature_table
                m19_pump_hours
                total_bath_fill_volume
                dt
                createdAt
                updatedAt
            }
            nextToken
            total
        }
    }
`;
export const getDeviceRegistration = /* GraphQL */ `
    query GetDeviceRegistration($serial: ID!) {
        getDeviceRegistration(serial: $serial) {
            serial
            dealer_id
            device_id
            user_uuid
            model
            gateway_dsn
            application_type
            recirculation_type
            install_datetime
            registration_type
            dealer_user_email
            active
            createdAt
            updatedAt
            customer {
                id
                name
                email
                admin
                approved
                confirmed
                aws_confirm
                imported
                country
                city
                state
                street
                zip
                company
                username
                firstname
                lastname
                st_accesstoken
                st_refreshtoken
                callbackurl_oauthtoken
                callbackurl_statecallback
                phone_country_code
                phone
                primary_contact
                terms_accepted
                terms_accepted_at
                terms_email_sent_at
                terms_token
                roles
                createdAt
                updatedAt
            }
        }
    }
`;
export const listDeviceRegistrations = /* GraphQL */ `
    query ListDeviceRegistrations(
        $serial: ID
        $filter: ModelDeviceRegistrationFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDeviceRegistrations(serial: $serial, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
            items {
                serial
                dealer_id
                device_id
                user_uuid
                model
                gateway_dsn
                application_type
                recirculation_type
                install_datetime
                registration_type
                dealer_user_email
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
export const registrationByDevice = /* GraphQL */ `
    query RegistrationByDevice(
        $device_id: ID
        $sortDirection: ModelSortDirection
        $filter: ModelDeviceRegistrationFilterInput
        $limit: Int
        $nextToken: String
    ) {
        registrationByDevice(device_id: $device_id, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                serial
                dealer_id
                device_id
                user_uuid
                model
                gateway_dsn
                application_type
                recirculation_type
                install_datetime
                registration_type
                dealer_user_email
                active
                createdAt
                updatedAt
            }
            nextToken
        }
    }
`;
