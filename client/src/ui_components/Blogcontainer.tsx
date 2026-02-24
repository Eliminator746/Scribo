import BlogCard, { BlogCardProps } from "./BlogCard";
import thumbnail from "@/images/design_vii.jpg";

const blogs: BlogCardProps[] = [
  {
    id: "1",
    title: "Build an Ecommerce Web App with Django and React",
    category: "Frontend",
    image: thumbnail,
    author: "Rohan",
    date: "Feb 2026",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Mastering RTK Query for Scalable Apps",
    category: "Redux",
    image: thumbnail,
    author: "Rohan",
    date: "Feb 2026",
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "Advanced TypeScript Patterns in React",
    category: "TypeScript",
    image: thumbnail,
    author: "Rohan",
    date: "Feb 2026",
    readTime: "7 min read",
  },
];

const BlogContainer = () => {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
        Latest Posts
      </h2>

      {/* Blog Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>

      {/* Empty State */}
      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No posts available.</p>
      )}
    </section>
  );
};

export default BlogContainer;
