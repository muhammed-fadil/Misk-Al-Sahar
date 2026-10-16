import { Link } from "react-router-dom";

function About() {
  return (
    <main className="bg-[#f8f5ef] text-[#1c1c1c]">

      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f5ef] via-[#fffdf8] to-[#f3eee6] px-5 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,123,36,0.12),transparent_60%)]" />
        <div className="relative w-full max-w-3xl animate-fade-in">

          <p className="mb-4 text-sm font-medium tracking-[4px] text-[#9a7b24]">
            ABOUT MISK AL-SAHAR
          </p>

          <h1 className="font-serif text-4xl font-semibold leading-tight text-[#744b4b] sm:text-5xl lg:text-6xl">
            The Essence of the Middle East
          </h1>

          <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#9a7b24] to-transparent" />

          <p className="mx-auto mt-2 max-w-2xl text-base leading-8 text-[#666] sm:text-lg">
            Misk Al-Sahar, meaning "Musk of Dawn", is inspired by
            the rich fragrance traditions of the Middle East.
          </p>

        </div>
      </section>


      <section className="border-t border-[#e5ded2] px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">

          <p className="mb-3 text-sm font-medium tracking-[3px] text-[#9a7b24]">
            OUR STORY
          </p>

          <h2 className="text-3xl font-semibold text-[#744b4b] sm:text-4xl">
            A Fragrance With a Story
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8 text-[#666] sm:text-lg">
            <p>
              Our journey begins with a simple idea: fragrance is more
              than just a scent. It is a way to express personality,
              create memories, and connect with special moments.
            </p>

            <p>
              Misk Al-Sahar brings together the timeless beauty of
              Middle Eastern perfumery with a modern approach to
              fragrance.
            </p>

            <p>
              From rich oud and warm amber to delicate musk and floral
              notes, every fragrance is selected to create its own
              unique character.
            </p>
          </div>

        </div>
      </section>


      <section className="bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">

          <p className="mb-3 text-sm font-medium tracking-[3px] text-[#9a7b24]">
            OUR INSPIRATION
          </p>

          <h2 className="text-3xl font-semibold text-[#744b4b] sm:text-4xl">
            Inspired by Tradition
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8 text-[#666] sm:text-lg">
            <p>
              Middle Eastern perfumery has a long and beautiful history.
              Traditional ingredients such as oud, musk, amber, rose,
              and spices have been part of fragrance culture for
              generations.
            </p>

            <p>
              Misk Al-Sahar takes inspiration from these traditional
              elements while presenting them in a way that fits the
              modern fragrance lover.
            </p>
          </div>

        </div>
      </section>


      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">

          <div className="text-center">
            <p className="mb-3 text-sm font-medium tracking-[3px] text-[#9a7b24]">
              OUR FRAGRANCE WORLD
            </p>

            <h2 className="text-3xl font-semibold text-[#744b4b] sm:text-4xl">
              Crafted With Character
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="group rounded-2xl border border-[#e4dccf]/30 bg-white p-7 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxury">
              <h3 className="font-serif text-2xl text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
                Oud
              </h3>

              <div className="mx-auto my-4 h-px w-8 bg-gradient-to-r from-transparent via-[#9a7b24]/50 to-transparent" />

              <p className="text-sm leading-7 text-[#666]">
                Deep, rich, and woody, oud adds a distinctive
                character to a fragrance.
              </p>
            </div>

            <div className="group rounded-2xl border border-[#e4dccf]/30 bg-white p-7 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxury">
              <h3 className="font-serif text-2xl text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
                Musk
              </h3>

              <div className="mx-auto my-4 h-px w-8 bg-gradient-to-r from-transparent via-[#9a7b24]/50 to-transparent" />

              <p className="text-sm leading-7 text-[#666]">
                Soft and warm, musk creates a smooth and elegant
                fragrance experience.
              </p>
            </div>

            <div className="group rounded-2xl border border-[#e4dccf]/30 bg-white p-7 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxury">
              <h3 className="font-serif text-2xl text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
                Amber
              </h3>

              <div className="mx-auto my-4 h-px w-8 bg-gradient-to-r from-transparent via-[#9a7b24]/50 to-transparent" />

              <p className="text-sm leading-7 text-[#666]">
                Warm and inviting, amber brings depth and richness
                to the fragrance.
              </p>
            </div>

            <div className="group rounded-2xl border border-[#e4dccf]/30 bg-white p-7 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxury">
              <h3 className="font-serif text-2xl text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
                Rose
              </h3>

              <div className="mx-auto my-4 h-px w-8 bg-gradient-to-r from-transparent via-[#9a7b24]/50 to-transparent" />

              <p className="text-sm leading-7 text-[#666]">
                Delicate and timeless, rose adds a beautiful floral
                character to our collection.
              </p>
            </div>

          </div>

        </div>
      </section>


      <section className="bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">

          <p className="mb-3 text-sm font-medium tracking-[3px] text-[#9a7b24]">
            OUR VISION
          </p>

          <h2 className="text-3xl font-semibold text-[#744b4b] sm:text-4xl">
            More Than Just a Perfume
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8 text-[#666] sm:text-lg">
            <p>
              We believe that a fragrance should be more than something
              you wear. It should become part of your identity,
              memories, and everyday moments.
            </p>

            <p>
              Our vision is to create a fragrance experience that feels
              elegant, memorable, and personal.
            </p>
          </div>

        </div>
      </section>


      <section className="relative overflow-hidden bg-gradient-to-br from-[#392016] via-[#4d2a1c] to-[#392016] px-5 py-24 text-center sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(154,123,36,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl">

          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Discover Your Scent
          </h2>

          <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#9a7b24] to-transparent" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Every person has a different style, and every fragrance
            tells a different story.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Explore the Misk Al-Sahar collection and find the scent
            that feels like you.
          </p>

          <Link
            to="/shop"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#9a7b24]/60 bg-[#9a7b24]/10 px-8 py-3 text-sm font-medium text-[#e6d5a8] backdrop-blur-sm transition-all duration-300 hover:bg-[#9a7b24] hover:text-white hover:shadow-luxury"
          >
            <span>Explore the Collection</span>
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

        </div>
      </section>

    </main>
  );
}

export default About;