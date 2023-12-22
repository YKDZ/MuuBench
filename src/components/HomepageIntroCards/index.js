import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import iconDocument from '@site/static/img/intro-icons/document.png';
import iconTutorial from '@site/static/img/intro-icons/tutorial.png';
import iconBlog from '@site/static/img/intro-icons/blog.png';

const introCardList = [
  {
    title: '产品文档',
    image: iconDocument,
    description: (
      <>
        一颗丁子个人面向用户开发了包括 Minecraft Spigot 插件在内的几类产品。
        这些产品的文档被集中托管在这个站点中以便用户查阅。
      </>
    ),
  },
  {
    title: '教程合集',
    image: iconTutorial,
    description: (
      <>
        一颗丁子以撰写教程为乐。写教程可以帮助他总结现有的知识并从中获取新的体会。
        当然，书写教程可以帮助到其他人也是很重要的一点。
      </>
    ),
  },
  {
    title: '博客',
    image: iconBlog,
    description: (
      <>
        一颗丁子也喜欢记录学习过程中的琐碎事件，这给他一种写日记的感觉。
        实际上他在小学二年级之后就再也没有写过日记了。
      </>
    ),
  },
];

function IntroCard({title, description, image}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} alt={title} className={styles.introCardImg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageIntroCards() {
  return (
    <section className={styles.introCards}>
      <div className="container">
        <div className="row">
          {introCardList.map((props, idx) => (
            <IntroCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
