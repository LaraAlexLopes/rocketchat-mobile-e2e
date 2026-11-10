/**
 * Android selectors built on UiAutomator2.
 * React Native exposes `testID` as the Android `resource-id`, so test ids are the primary strategy.
 */
const quote = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const regex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const byTestId = (testId: string) => `android=new UiSelector().resourceId("${quote(testId)}")`;

export const byText = (text: string) => `android=new UiSelector().text("${quote(text)}")`;

/** Android renders alert buttons in uppercase, so button labels are matched case-insensitively. */
export const byButtonText = (label: string) =>
  `android=new UiSelector().textMatches("${quote(`(?i)^${regex(label)}$`)}")`;
