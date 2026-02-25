import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

type HeroProps = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

const Hero = ({ name, role, bio, avatar }: HeroProps) => {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto bg-gray-100 rounded-xl flex flex-col items-center gap-6 text-center">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="text-left">
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-base leading-relaxed max-w-3xl">{bio}</p>

      {/* Social Links */}
      <div className="flex gap-4">
        <SocialIcon>
          <FaInstagram />
        </SocialIcon>
        <SocialIcon>
          <FaFacebookF />
        </SocialIcon>
        <SocialIcon>
          <BsTwitterX />
        </SocialIcon>
        <SocialIcon>
          <FaYoutube />
        </SocialIcon>
      </div>
    </section>
  );
};

export default Hero;

/* Reusable Social Icon Component */
const SocialIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-600 hover:bg-gray-800 transition text-white flex items-center justify-center cursor-pointer">
      {children}
    </div>
  );
};
