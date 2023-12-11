# novu-starter

<!-- Basic CRUD application with trpc, fastify, and prisma. -->

The tutorial for novu with nextjs.

[Click a article for this project](https://zenn.com/cookiegg/articles/novu-starter)

## Getting Started

### Install dependencies

```bash
bun
```

### Setup Novu

1. Create your Novu account

   https://docs.novu.co/getting-started/novu-sign-up

2. Create a new workflow

   https://docs.novu.co/workflows/notification-workflows

### Create .env.local file

```bash
touch .env.local
```

Each value, referenced from Novu, can be found in the Novu dashboard.

```bash
NEXT_PUBLIC_NOVU_APP_INDENTIFIER=""

NOVU_API_KEY=""
NOVU_TOPIC_KEY=""
WORKFLOW_IDENTIFIER=""
```

### Run dev server

```bash
bun dev
```
