const root = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')

function studyImage(filename) {
  return `${root}study-path/${filename}`
}

export const studyPathSlides = [
  {
    id: 'study-path-1',
    imageSrc: studyImage('card-1.svg'),
    caption: 'Choose your pathway',
    alt: 'Path overview',
  },
  {
    id: 'study-path-2',
    imageSrc: studyImage('card-2.svg'),
    caption: 'Plan your timeline',
    alt: 'Timeline',
  },
  {
    id: 'study-path-3',
    imageSrc: studyImage('card-3.svg'),
    caption: 'Visa essentials',
    alt: 'Visa',
  },
  {
    id: 'study-path-4',
    imageSrc: studyImage('card-4.svg'),
    caption: 'Work while you study',
    alt: 'Work rights',
  },
  {
    id: 'study-path-5',
    imageSrc: studyImage('card-5.svg'),
    caption: 'After graduation',
    alt: 'Graduation',
  },
]
