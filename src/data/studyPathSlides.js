const root = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')

function studyImage(filename) {
  return `${root}study-path/${filename}`
}

export const studyPathSlides = [
  {
    id: 'study-path-1',
    imageSrc: studyImage('card-1.svg'),
    caption: 'Choose your pathway',
    alt: 'Study pathway overview graphic',
  },
  {
    id: 'study-path-2',
    imageSrc: studyImage('card-2.svg'),
    caption: 'Plan your timeline',
    alt: 'Timeline and milestones for studying in Australia',
  },
  {
    id: 'study-path-3',
    imageSrc: studyImage('card-3.svg'),
    caption: 'Visa essentials',
    alt: 'Student visa and compliance essentials',
  },
  {
    id: 'study-path-4',
    imageSrc: studyImage('card-4.svg'),
    caption: 'Work while you study',
    alt: 'Work rights and part-time work while studying',
  },
  {
    id: 'study-path-5',
    imageSrc: studyImage('card-5.svg'),
    caption: 'After graduation',
    alt: 'Post-study work and further pathways',
  },
]
