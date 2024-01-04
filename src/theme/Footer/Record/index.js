import React from 'react';
import './style.css';

function FooterRecord() {
  const additionalLinks = [
    {
      label: '粤 ICP 备 2023158779 号',
      href: 'https://beian.miit.gov.cn/',
    },
    {
      label: '粤公网安备 44030002002026 号',
      href: 'https://beian.mps.gov.cn/#/query/webSearch?code=44030002002026',
      imgSrc: 'img/beian.png',
    },
  ];

  return (
    <div className="footer-record-container">
      {additionalLinks.map((link, index) => (
        <div key={index} className="footer-record-entry">
          {link.imgSrc && (
            <img src={link.imgSrc} alt="Image" className="footer-record-image" />
          )}
          <a href={link.href} className="footer-record-link">
            {link.label}
          </a>
        </div>
      ))}
    </div>
  );
}

export default FooterRecord;