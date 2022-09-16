import {Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';

const FadeInOutView = (props) => {
    const fadeAnim = useRef(new Animated.Value(props.values[0])).current; // Initial value for opacity: 0

    useEffect(() => {
        Animated.loop(
            Animated.sequence(
                props.values.map((value, index) => {
                    return Animated.timing(fadeAnim, {
                        toValue: value,
                        duration: props.timings[index],
                        useNativeDriver: true,
                    });
                }),
            ),
        ).start();
    }, [fadeAnim, props.values, props.timings]);

    return (
        <Animated.View // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim, // Bind opacity to animated value
            }}>
            {props.children}
        </Animated.View>
    );
};

export default FadeInOutView;
