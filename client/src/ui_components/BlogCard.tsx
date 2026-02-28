import Badge from "./Badge";
import CardFooter from "./Cardfooter";
import { Link } from "react-router-dom";
import { User } from "@/features/types";

export type BlogCardProps = {
  id: number;
  title: string;
  category: string;
  featured_image?: string;
  author: User;
  created_at: string;
  read_time?: number;
  slug: string;
};

const BlogCard = ({
  title,
  category,
  featured_image,
  author,
  created_at,
  read_time,
  slug,
}: BlogCardProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-md dark:shadow-black/30 overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/50 transition duration-300 bg-white dark:bg-gray-800">
      {/* Image */}
      <div className="h-200px overflow-hidden">
        <img
          src={featured_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 grow">
        <Badge label={category} />

        <Link to={`/detail/${slug}`}>
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white leading-snug">
            {title}
          </h3>
        </Link>

        <CardFooter
          author={author.username}
          date={created_at}
          readTime={read_time?.toString()}
        />
      </div>
    </div>
  );
};

export default BlogCard;
