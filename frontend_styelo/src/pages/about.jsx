
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import aboutMain from "../assets/aboutus1.png";
import about1 from "../assets/aboutus2.png";
import about2 from "../assets/aboutus3.png";
import about3 from "../assets/aboutus4.png";
import about4 from "../assets/aboutus5.png";

const AboutUs = () => {
  return (
  <>
    <Navbar/>

      {/* About Us Section */}
      <main className="px-12 py-16 max-w-screen-xl mx-auto  font-poppins">
        <h2 className="text-3xl font-semibold text-center mb-14">About Us</h2>

        {/* Image Grid */}
        <div className="grid grid-cols-5 gap-4 items-center mb-12">
          <div className="col-span-2 rounded-xl overflow-hidden">
            <img
              src={aboutMain}
              alt="Main desk image"
              className="w-full h-130 object-cover"
            />
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <img
              src={about2}
              alt="Chair"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about3}
              alt="Bedside"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about1}
              alt="Chair flipped"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about4}
              alt="Chair quote"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-[15px] text-gray-800 leading-7 max-w-5xl mx-auto">
          <p className="mb-6">
            “Styelo – Made in Nepal,” where we take pride in transforming houses into homes with our exquisite
            range of furnishing and decor products. As Nepal’s first premium furnishing brand, we embark on a journey
            to redefine elegance and sophistication, all while championing the beauty of locally crafted items. Our
            commitment lies in producing and promoting MADE IN NEPAL products that reflect superior quality and
            craftsmanship.
          </p>
          <p className="mb-6">
            At Styelo, we believe in more than just decorating spaces; we aspire to create an immersive experience that
            resonates with the unique charm of Nepali artistry. Our dedication to being the first premium furnishing brand
            in Nepal underscores our passion for setting new standards of excellence in the industry.
          </p>
          <p className="mb-6">
            What sets us apart is our unwavering commitment to customer satisfaction and value for money. Each of our
            products is a testament to the meticulous attention to detail and the love poured into its creation. We strive
            to elevate the aesthetic appeal of your living spaces, ensuring that every piece not only complements your style
            but also narrates a story deeply rooted in Nepali craftsmanship.
          </p>
          <p>
            Join us on this exciting journey as we redefine the dynamics of home furnishing and decor, one exceptional
            product at a time. Styelo – Made in Nepal, where tradition meets modernity, and every piece is a celebration
            of Nepali artistry. Welcome home.
          </p>
        </div>
      </main>
          <Footer />        

     
    </>
  );
};

export default AboutUs;
