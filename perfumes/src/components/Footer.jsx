import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#2b1710] via-[#392016] to-[#2b1710] text-[#e8ddcb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,123,36,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link to="/" className="font-serif text-3xl text-[#e6d5a8] transition-colors duration-300 hover:text-white">
              مِسْك السَّحَر
            </Link>

            <div className="my-5 h-px w-16 bg-gradient-to-r from-[#9a7b24] to-transparent" />

            <p className="max-w-xs text-sm leading-7 text-[#c9bba4]">
              Timeless fragrances inspired by the warmth, mystery,
              and elegance of the Middle East.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[3px] text-[#9a7b24]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link to="/" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Home
              </Link>
              <Link to="/shop" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Shop
              </Link>
              <Link to="/about" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                About
              </Link>
              <Link to="/wishlist" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Wishlist
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[3px] text-[#9a7b24]">
              Customer Care
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link to="/cart" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Your Cart
              </Link>
              <Link to="/orders" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                My Orders
              </Link>
              <Link to="/login" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Login
              </Link>
              <Link to="/register" className="w-fit text-[#c9bba4] transition-all duration-300 hover:translate-x-1 hover:text-[#e6d5a8]">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#e6d5a8]/10 pt-8 sm:flex-row">
          <p className="text-xs tracking-wide text-[#a8987f]">
            © {new Date().getFullYear()} Misk Al-Sahar. All rights reserved.
          </p>

          <p className="text-xs tracking-[2px] text-[#9a7b24]">
            CRAFTED WITH ELEGANCE
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
