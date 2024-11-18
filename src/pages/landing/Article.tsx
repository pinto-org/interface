import React from "react";
import ReactMarkdown from 'react-markdown';
import PintoLaunchArticle from "./articles/test-notion.md";
import Text from "./../../components/ui/Text";
import PageContainer from "@/components/ui/PageContainer";

const LaunchArticle: React.FC = () => {
  return (
    <Article value={PintoLaunchArticle}></Article>
  );
}

export default LaunchArticle;

interface ArticleProps {
  value: string;
}

const Article: React.FC<ArticleProps> = ({ value }) => {
  return (
    <article className="prose lg:prose-xl max-w-[752px] mx-auto pb-16">
      <ReactMarkdown
      components={{
        h1: ({children}) => (
          <Text variant="h1" weight="thin" color="primary" className="my-4">{children}</Text>
        ),
        h2: ({children}) => (
          <Text variant="h2" weight="thin" color="primary" className="mt-12">{children}</Text>
        ),
        h3: ({children}) => (
          <Text variant="h3" weight="thin" color="primary" className="mt-12">{children}</Text>
        ),
        p: ({children}) => (
          <Text variant="body" weight="thin" color="primary" className="my-4">{children}</Text>
        )
      }}
      >
        {value}
      </ReactMarkdown>
    </article>
  );
};
