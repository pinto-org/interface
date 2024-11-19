import React from "react";
import ReactMarkdown from "react-markdown";
import PintoLaunchArticle from "./articles/announcing-pinto.md";
import Text from "./../../components/ui/Text";
import PageContainer from "@/components/ui/PageContainer";
import ParticlesBackground from "./utils/ParticlesBackground";

const LaunchArticle: React.FC = () => {
  return (
    <PageContainer variant="full">
      {/* <div className="z-[-1] h-40">
        <ParticlesBackground />
      </div> */}
      <Article value={PintoLaunchArticle} />
    </PageContainer>
  );
};

export default LaunchArticle;

interface ArticleProps {
  value: string;
}

const Article: React.FC<ArticleProps> = ({ value }) => {
  return (
    <article className="prose lg:prose-xl max-w-[776px] mx-auto pb-16">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Text variant="h2" weight="medium" color="primary" className="my-4 mb-8">
              {children}
            </Text>
          ),
          h2: ({ children }) => (
            <Text variant="h3" weight="thin" color="primary" className="mt-16 mb-8">
              {children}
            </Text>
          ),
          h3: ({ children }) => (
            <Text variant="h3" weight="thin" color="primary" className="mt-16">
              {children}
            </Text>
          ),
          p: ({ children }) => (
            <Text variant="body" weight="thin" color="primary" className="my-4 leading-1">
              {children}
            </Text>
          ),
          strong: ({ children }) => (
            <>
              <span className="font-semibold text-primary">{children}</span>
            </>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pinto-green-4 underline hover:text-pinto-green-3"
            >
              {children}
            </a>
          ),
          em: ({ children }) => (
            <>
              <span className="italic text-primary">{children}</span>
            </>
          ),
          li: ({ children }) => (
            <li className="list-disc ml-8 pb-4">
              <Text variant="body" weight="thin" color="primary" className="leading-1">
                {children}
              </Text>
            </li>
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </article>
  );
};
