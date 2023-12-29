import React from 'react';
import clsx from 'clsx';
export default function FooterLayout({style, links, logo, copyright, record}) {
  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        {links}
        {(logo || copyright || record) && (
          <div className="footer__bottom text--center">
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright}
            {record}
          </div>
        )}
      </div>
    </footer>
  );
}
