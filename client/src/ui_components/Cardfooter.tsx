type CardFooterProps = {
  author: string;
  date: string;
  readTime?: string;
};

const CardFooter = ({ author, date, readTime }: CardFooterProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
      <span>By {author}</span>

      <div className="flex items-center gap-2">
        <span>{date}</span>
        {readTime && <span>• {readTime}</span>}
      </div>
    </div>
  );
};

export default CardFooter;
