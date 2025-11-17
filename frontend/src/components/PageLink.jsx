const PageLink = ({ link, itemClass }) => {
  return (
    <li>
      <a href={link.href} className={`flex items-center text-white w-full gap-1 transition-transform duration-200 hover:-translate-y-1 ${itemClass}`}>
        <span className="capitalize">{link.text}</span>
      </a>
    </li>
  );
};
export default PageLink;