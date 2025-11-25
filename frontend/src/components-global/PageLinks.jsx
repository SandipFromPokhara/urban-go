import { pageLinks } from "../data";
import PageLink from "./PageLink";

const PageLinks = ({ parentClass = "", itemClass = "" }) => {
  return (
    <ul className={`h-auto transition ${parentClass}`}>
      {pageLinks.map((link) => (
        <PageLink key={link.id} link={link} itemClass={itemClass} />
      ))}
    </ul>
  );
};

export default PageLinks;
