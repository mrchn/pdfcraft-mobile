// @/components/haptics (pdfcraft-mobile)

import * as Haptics from 'expo-haptics';

const IMPACT_STYLES = {
	light: Haptics.ImpactFeedbackStyle.Light,
	medium: Haptics.ImpactFeedbackStyle.Medium,
	heavy: Haptics.ImpactFeedbackStyle.Heavy,
	soft: Haptics.ImpactFeedbackStyle.Soft,
	rigid: Haptics.ImpactFeedbackStyle.Rigid
} as const;

export function hapticTap(
	style: keyof typeof IMPACT_STYLES = 'rigid'
) {
	const feedbackStyle = IMPACT_STYLES[style];
	if (feedbackStyle) { Haptics.impactAsync(feedbackStyle) }
}