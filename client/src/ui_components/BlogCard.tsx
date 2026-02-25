import Badge from "./Badge";
import CardFooter from "./Cardfooter";
import { Link } from "react-router-dom";

export type BlogCardProps = {
  id: string;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime?: string;
};

const BlogCard = ({
  title,
  category,
  image,
  author,
  date,
  readTime,
}: BlogCardProps) => {
  return (
    <div className="flex flex-col rounded-xl border shadow-md overflow-hidden hover:shadow-lg transition duration-300 bg-white">
      {/* Image */}
      <div className="h-200px overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 grow">
        <Badge label={category} />

        <Link to="/detail">
          <h3 className="font-semibold text-lg text-gray-800 leading-snug">
            {title}
          </h3>
        </Link>

        <CardFooter author={author} date={date} readTime={readTime} />
      </div>
    </div>
  );
};

export default BlogCard;
