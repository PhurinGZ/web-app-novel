module.exports = ({ env }) => ({
  "vercel-deploy": {
    enabled: true,
    config: {
      deployHook:
        "https://api.vercel.com/v1/integrations/deploy/prj_tcC3fP3e8gLhtLPOLIdmNZql3LGG/euLkYKNOXY",
      apiToken: "iR65LYAa1Jsr1c2MbeQuUgrm",
      appFilter: "web-app-novel",
      roles: ["strapi-super-admin", "strapi-editor", "strapi-author"],
    },
    // "users-permissions": {
    //   config: {
    //     jwt: {
    //       expiresIn: "1y",
    //     },
    //   },
    // },
  },
});
