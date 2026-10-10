export interface Language {
  code: 'en' | 'ru' | 'tj'
  labelKey: 'header.language.english' | 'header.language.russian' | 'header.language.tajik'
  flag: string
}

/** Единственный источник списка языков — не дублировать в компонентах. */
export const LANGUAGES: Language[] = [
  {
    code: 'en',
    labelKey: 'header.language.english',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1024px-Flag_of_the_United_Kingdom_%283-5%29.svg.png',
  },
  {
    code: 'tj',
    labelKey: 'header.language.tajik',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/2560px-Flag_of_Tajikistan.svg.png',
  },
  {
    code: 'ru',
    labelKey: 'header.language.russian',
    flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYo9xokjFiNZypS-HrcUiYsLuh-rPb3zKsQ&s',
  },
]
