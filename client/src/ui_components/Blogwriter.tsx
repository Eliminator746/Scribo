type BlogWriterProps = {
  name: string;
  date: string;
  avatar: string;
};

const BlogWriter = ({ name, date, avatar }: BlogWriterProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
      </div>

      {/* Date */}
      <span className="text-sm text-gray-500 dark:text-gray-500">{date}</span>
    </div>
  );
};

export default BlogWriter;
