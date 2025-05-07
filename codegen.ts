import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    "src/generated/gql/pintostalk/": {
      schema: "https://graph.pinto.money/pintostalk",
      documents: ["src/queries/beanstalk/**/*.graphql"],
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "src/generated/gql/pinto/": {
      schema: "https://graph.pinto.money/pinto",
      documents: ["src/queries/bean/**/*.graphql"],
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "src/generated/gql/exchange/": {
      schema: "https://graph.pinto.money/exchange",
      documents: ["src/queries/basin/**/*.graphql"],
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
