import { Link } from "react-router-dom";

const PageLink = ({ link, itemClass }) => {
  return (
    <li>
      <Link
        to={link.href} // use 'to' instead of 'href'
        className={`flex items-center text-white w-full gap-1 transition-transform duration-200 hover:-translate-y-1 ${itemClass}`}
      >
        <span className="capitalize">{link.text}</span>
      </Link>
    </li>
  );
};

export default PageLink;
