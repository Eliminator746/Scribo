import { useGetBlogsQuery } from "@/features/apiSlice";
import BlogCard from "./BlogCard";
import PagePagination from "./PagePagination";
import { useMemo, useState } from "react";

const BlogContainer = () => {
  const [page, setPage] = useState(1);
  const numOfBlogsPerPage = 8;
  const start = (page - 1) * numOfBlogsPerPage;

  const { data, isLoading, isError } = useGetBlogsQuery({
    limit: numOfBlogsPerPage,
    start,
  });

  const blogs = data?.results || [];
  const totalItems = data?.count || 0;
  const totalPages = useMemo(
    () => Math.ceil(totalItems / numOfBlogsPerPage),
    [totalItems, numOfBlogsPerPage],
  );
  function handleSetPage(val: any) {
    setPage(val);
  }

  function increasePageValue() {
    setPage((curr) => curr + 1);
  }

  function decreasePageValue() {
    setPage((curr) => curr - 1);
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <>
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
      <PagePagination
        page={page}
        totalPages={totalPages}
        increasePageValue={increasePageValue}
        decreasePageValue={decreasePageValue}
        handleSetPage={handleSetPage}
      />
    </>
  );
};

export default BlogContainer;
