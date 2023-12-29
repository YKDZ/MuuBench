import React from 'react';
import './style.css'; // 引入样式文件

function FooterRecord() {
  const additionalLinks = [
    {
      label: '粤 ICP 备 2023158779 号',
      href: 'https://beian.miit.gov.cn/',
    },
    {
      label: '公安备案号',
      href: '/public-security-beian',
    },
  ];

  return (
    <div className="footer-record-container">
      {additionalLinks.map((link, index) => (
        <a key={index} href={link.href} className="footer-record-link">
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default FooterRecord;
