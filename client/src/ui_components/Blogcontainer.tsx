import { useGetBlogsQuery } from "@/features/apiSlice";
import BlogCard from "./BlogCard";

const BlogContainer = () => {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-10">
        Latest Posts
      </h2>

      {/* Blog Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!isLoading &&
          blogs.map((blog) => <BlogCard key={blog.id} {...blog} />)}
      </div>

      {/* Empty State */}
      {blogs.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No posts available.
        </p>
      )}
    </section>
  );
};

export default BlogContainer;
