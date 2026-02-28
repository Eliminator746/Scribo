import { useParams } from "react-router-dom";
import { useGetBlogDetailQuery } from "@/features/apiSlice";
import Badge from "@/ui_components/Badge";
import BlogWriter from "@/ui_components/Blogwriter";

const DetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <p>Invalid blog URL.</p>;
  const { data: blog, isLoading, isError } = useGetBlogDetailQuery(slug);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !blog)
    return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <Badge label={blog.category} />

      <h1 className="mt-6 text-3xl md:text-4xl font-semibold leading-snug text-gray-900 dark:text-white">
        {blog.title}
      </h1>

      <div className="mt-6">
        <BlogWriter
          name={blog.author.username}
          date={new Date(blog.created_at).toLocaleDateString()}
          avatar={blog.author.profile_picture}
        />
      </div>

      {blog.featured_image && (
        <div className="w-full h-300px md:h-400px my-10 overflow-hidden rounded-xl">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="space-y-6 text-gray-700 dark:text-gray-300 leading-8 text-base text-justify">
        <p>{blog.content}</p>
      </article>
    </section>
  );
};

export default DetailPage;
