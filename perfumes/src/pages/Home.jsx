import { Link } from "react-router-dom";




function Home() {
  return (
    <main>
      <section className="perfume">

        <div className="perfume-content">
          <p className="perfume-subtitle">
            M U S K &nbsp; O F &nbsp; T H E &nbsp; D A W N
          </p>

          <h1>Misk Al-Sahar</h1>

          <p className="perfume-description">
            Discover the timeless beauty of Middle Eastern
            perfumes, crafted with elegance and tradition.
          </p>

         <Link to="/shop" className="perfume-button">
            Explore Collection
          </Link>
        </div>

      </section>

      <section className="preview" >
       <div className="content">
        <p >OUR COLLECTION</p>
        <h2 className="a"> Signature Perfumes </h2>
        <div className="b">
          <div className="royal">
            <h3>royal Oud</h3>
            <p>Oud & Amber</p>
            <h3>$2999</h3>
          </div>
          <div className="royal">
            <h3>White Musk</h3>
            <p>soft musk  & Rose</p>
             <h3>$2999</h3>
            </div>
            <div className="royal">
              <h3>Golden Amber</h3>
              <p>Amber & Saffron</p>
               <h3>$2999</h3>
            </div>
        </div>
        </div>
        
      </section>
      
<section className="preview">

  <div className="content">

    <p className="label">
      OUR STORY
    </p>

    <h2>
      The Essence of the Middle East
    </h2>

    <p>
      Misk Al-Sahar is inspired by the timeless fragrance traditions
      of the Middle East. Each scent is created to reflect elegance,
      warmth, and the beauty of unforgettable moments.
    </p>

    <Link to="/about" className="button">
      Discover Our Story
    </Link>

  </div>

</section>

    </main>
  );
}

export default Home;