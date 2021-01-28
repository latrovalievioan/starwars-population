/**
 * Here you can define helper functions to use across your app.
 */
export default function delay(s) {
  const ms = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
