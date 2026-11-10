const quote = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const regex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const xpathLiteral = (value: string) => (value.includes('"') ? `'${value}'` : `"${value}"`);

export const byTestId = (testId: string) => {
  const id = xpathLiteral(testId);
  return `//*[@resource-id=${id} or @content-desc=${id}]`;
};

export const byTestIdContainingAll = (...parts: string[]) =>
  `//*[${parts.map(part => `contains(@resource-id, ${xpathLiteral(part)})`).join(' and ')}]`;

export const byText = (text: string) => `android=new UiSelector().text("${quote(text)}")`;

export const byButtonText = (label: string) =>
  `android=new UiSelector().textMatches("${quote(`(?i)^${regex(label)}$`)}")`;
