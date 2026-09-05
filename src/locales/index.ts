import { en } from './en';
import { vi } from './vi';
import type { Language, LocaleDictionary } from './types';

export const dictionaries: Record<Language, LocaleDictionary> = {
  en,
  vi,
};

export type { Language, LocaleDictionary };