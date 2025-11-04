import dayjs from "dayjs";
import { createI18n } from "vue-i18n";

import("dayjs/locale/en");
import("dayjs/locale/zh-cn");

// All i18n resources specified in the plugin `include` option can be loaded
// at once using the import syntax
import messages from "@intlify/unplugin-vue-i18n/messages";

export function detectLocale() {
  // locale is an RFC 5646 language tag
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
  let locale = navigator.language.toLowerCase();
  switch (true) {
    case /^en\b/.test(locale):
      locale = "en";
      break;
    case /^zh-cn\b/.test(locale):
    case /^zh\b/.test(locale):
      locale = "zh-cn";
      break;
    default:
      locale = "zh-cn";
  }

  return locale;
}

// TODO: was this really necessary?
// function removeEmpty(obj: Record<string, any>): void {
//   Object.keys(obj)
//     .filter((k) => obj[k] !== null && obj[k] !== undefined && obj[k] !== "") // Remove undef. and null and empty.string.
//     .reduce(
//       (newObj, k) =>
//         typeof obj[k] === "object"
//           ? Object.assign(newObj, { [k]: removeEmpty(obj[k]) }) // Recurse.
//           : Object.assign(newObj, { [k]: obj[k] }), // Copy value.
//       {}
//     );
// }

export const i18n = createI18n({
  locale: detectLocale(),
  fallbackLocale: "zh-cn",
  messages,
  // expose i18n.global for outside components
  legacy: true,
});

export function setLocale(locale: string) {
  dayjs.locale(locale);
  // according to doc u only need .value if legacy: false but they lied
  // https://vue-i18n.intlify.dev/guide/essentials/scope.html#local-scope-1
  // @ts-expect-error incorrect type when legacy
  i18n.global.locale.value = locale;
}

export function setHtmlLocale(locale: string) {
  const html = document.documentElement;
  html.lang = locale;
}

export default i18n;
