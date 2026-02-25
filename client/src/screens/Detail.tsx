import Badge from "@/ui_components/Badge";
import banner from "@/images/detailBanner.jpg";
import avatar from "@/images/pic.jpg";
import BlogWriter from "@/ui_components/Blogwriter";

const DetailPage = () => {
  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      {/* Category */}
      <Badge label="Frontend" />

      {/* Title */}
      <h1 className="mt-6 text-3xl md:text-4xl font-semibold leading-snug text-gray-900 dark:text-white">
        Build an Ecommerce Web App with Django and React
      </h1>

      {/* Author Info */}
      <div className="mt-6">
        <BlogWriter name="John Doe" date="12 November, 2024" avatar={avatar} />
      </div>

      {/* Banner Image */}
      <div className="w-full h-300px md:h-400px my-10 overflow-hidden rounded-xl">
        <img
          src={banner}
          alt="Build Ecommerce Web App"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blog Content */}
      <article className="space-y-6 text-gray-700 dark:text-gray-300 leading-8 text-base text-justify">
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>

        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt.
        </p>

        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit, sed quia non numquam eius modi tempora
          incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </p>

        <p>
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
          autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur.
        </p>
      </article>
    </section>
  );
};

export default DetailPage;
