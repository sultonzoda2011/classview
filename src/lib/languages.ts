export interface Language {
	code: 'en' | 'ru' | 'tj'
	labelKey:
		| 'header.language.english'
		| 'header.language.russian'
		| 'header.language.tajik'
	flag: string
}

/** Единственный источник списка языков — не дублировать в компонентах. */
export const LANGUAGES: Language[] = [
	{
		code: 'en',
		labelKey: 'header.language.english',
		flag: '/locales/icons/en.png'
	},
	{
		code: 'tj',
		labelKey: 'header.language.tajik',
		flag: '/locales/icons/tj.png'
	},
	{
		code: 'ru',
		labelKey: 'header.language.russian',
		flag: '/locales/icons/ru.png'
	}
]
