export function findElement(xpath: string): HTMLElement | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );

  return result.iterateNext() as HTMLElement | null;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
