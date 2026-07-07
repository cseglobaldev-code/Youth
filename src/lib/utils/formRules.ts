import type { Rule } from 'antd/es/form';

// Accepts URLs with or without a protocol: "example.com", "www.example.com/x",
// "https://sub.example.com". Rejects strings with spaces or without a dot.
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

// Accepts digits with optional spaces, dashes, parentheses and a leading +.
// Requires 6-15 digits total (ITU E.164 upper bound, sensible lower bound).
const PHONE_PATTERN = /^\+?[\d\s().-]{6,20}$/;
const DIGIT_COUNT = /\d/g;

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

/** URL format check. Skips empty values so it can pair with (or replace) a `required` rule. */
export function urlRule(message = 'Please enter a valid URL'): Rule {
  return {
    validator: (_, value: string) =>
      !value || URL_PATTERN.test(value.trim())
        ? Promise.resolve()
        : Promise.reject(new Error(message)),
  };
}

/** Phone format check: allowed separators plus 6-15 actual digits. Skips empty values. */
export function phoneRule(message = 'Please enter a valid phone number'): Rule {
  return {
    validator: (_, value: string) => {
      if (!value) return Promise.resolve();
      const digits = (value.match(DIGIT_COUNT) ?? []).length;
      return PHONE_PATTERN.test(value.trim()) && digits >= 6 && digits <= 15
        ? Promise.resolve()
        : Promise.reject(new Error(message));
    },
  };
}

/** Word-count ceiling. Skips empty values. */
export function maxWordsRule(limit: number, message?: string): Rule {
  return {
    validator: (_, value: string) =>
      !value || countWords(value) <= limit
        ? Promise.resolve()
        : Promise.reject(new Error(message ?? `Please keep your answer within ${limit} words`)),
  };
}
