// @/components/theme/motion

export const Motion = {

	spring: {
		damping: 20, stiffness: 300,
		mass: 1, overshootClamping: false
	},
	springExpressive: {
		damping: 14, stiffness: 250,
		mass: 1, overshootClamping: false
	},

	// durations (ms) for non-spring animations
	durationShort1:   50, durationShort2:  100,
	durationMedium1: 200, durationMedium2: 300,
	durationLong1:   450, durationLong2:   600,

	// easing names (use with Easing from react-native)
	emphasizedEasing: 'cubic-bezier(0.2, 0, 0, 1.0)',
	emphasizedDecelerating: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
	emphasizedAccelerating: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
	standardEasing: 'cubic-bezier(0.2, 0, 0, 1.0)'

} as const;