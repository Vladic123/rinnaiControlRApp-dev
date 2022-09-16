export const onUpdateDeviceInfo = /* GraphQL */ `
    subscription OnUpdateDeviceInfo($serial_id: String!) {
        onUpdateDeviceInfo(serial_id: $serial_id) {
            serial_id
            ayla_dsn
            name
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
            operation_hours
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
        }
    }
`;

export const onCreateDeviceErrorHistory = /* GraphQL */ `
    subscription OnCreateDeviceErrorHistory($serial_id: String!) {
        onCreateDeviceErrorHistory(serial_id: $serial_id) {
            id
            serial_id
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
        }
    }
`;

export const onUpdateDeviceShadow = /* GraphQL */ `
    subscription OnUpdateDeviceShadow($heater_serial_number: String!) {
        onUpdateDeviceShadow(heater_serial_number: $heater_serial_number) {
            heater_serial_number
            ayla_dsn
            rinnai_registered
            do_maintenance_retrieval
            model
            module_log_level
            set_priority_status
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
        }
    }
`;

export const onUpdateDeviceActivity = /* GraphQL */ `
    subscription OnUpdateDeviceActivity($clientId: String!) {
        onUpdateDeviceActivity(clientId: $clientId) {
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
        }
    }
`;
