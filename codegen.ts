import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    "https://graph.node.bean.money/subgraphs/name/beanstalk",
    "https://graph.node.bean.money/subgraphs/name/bean",
  ],
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "src/generated/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
