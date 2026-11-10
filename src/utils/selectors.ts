/**
 * Android selectors.
 * React Native may expose `testID` as `resource-id` or as `content-desc` depending on the build,
 * so test ids are matched against both.
 */
const quote = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const regex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const xpathLiteral = (value: string) => (value.includes('"') ? `'${value}'` : `"${value}"`);

export const byTestId = (testId: string) => {
  const id = xpathLiteral(testId);
  return `//*[@resource-id=${id} or @content-desc=${id}]`;
};

export const byText = (text: string) => `android=new UiSelector().text("${quote(text)}")`;

/** Android renders alert buttons in uppercase, so button labels are matched case-insensitively. */
export const byButtonText = (label: string) =>
  `android=new UiSelector().textMatches("${quote(`(?i)^${regex(label)}$`)}")`;
