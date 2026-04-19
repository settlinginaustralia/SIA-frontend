import React from 'react'
import '../styles/SiaCard.css'

function Home() {
  return (
    <div className="sia-page">
      <section className="sia-card" aria-labelledby="home-intro-heading">
        <h1 id="home-intro-heading" className="sia-card__title">
          Home
        </h1>
        <p className="sia-card__body">
          Welcome. Use the links above to explore the site.
        </p>
      </section>
    </div>
  )
}

export default Home
