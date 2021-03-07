import React from "react";
import Link from "next/link";

interface InternalExternalLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

const InternalExternalLink: React.FC<InternalExternalLinkProps> = ({
  to,
  children,
  ...props
}) => {
  if (to.startsWith("http") || to.startsWith("mailto")) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  console.log(props);

  return (
    <Link href={to} passHref>
      <a {...props}>{children}</a>
    </Link>
  );
};

export { InternalExternalLink };
