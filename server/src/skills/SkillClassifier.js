/**
 * SkillClassifier
 *
 * A deterministic, application-level skills classification engine.
 * AI is responsible ONLY for extracting skill names from resume text.
 * This module is the single source of truth for which bucket a technology belongs to.
 *
 * Rules:
 * - Every extracted skill is either mapped to a bucket or falls into 'technologies' (never discarded).
 * - Lookup is case-insensitive. Punctuation-normalized (dots, hyphens, spaces treated flexibly).
 * - Thin buckets (< MIN_BUCKET_SIZE items) are merged into 'technologies' ONLY at render time,
 *   not during classification — the full data is always preserved in the database.
 */

export const BUCKET_LABELS = {
  languages:      'Languages',
  frontend:       'Frontend',
  backend:        'Backend',
  databases:      'Databases',
  aiLlm:          'AI & LLM',
  cloudDevOps:    'Cloud & DevOps',
  developerTools: 'Developer Tools',
  coreConcepts:   'Core Concepts',
  technologies:   'Technologies',   // fallback — never discarded
};

export const CANONICAL_BUCKETS = [
  'languages', 'frontend', 'backend', 'databases',
  'aiLlm', 'cloudDevOps', 'developerTools', 'coreConcepts', 'technologies',
];

/** Minimum items a bucket must have to be shown independently in the preview/PDF */
export const MIN_BUCKET_SIZE = 3;

// ---------------------------------------------------------------------------
// Master lookup table: normalized skill name → bucket key
// Add new entries here — never in AI prompts.
// ---------------------------------------------------------------------------
const SKILL_MAP = {
  // ── Languages ──────────────────────────────────────────────────────────
  'python':             'languages',
  'javascript':         'languages',
  'js':                 'languages',
  'typescript':         'languages',
  'ts':                 'languages',
  'java':               'languages',
  'c':                  'languages',
  'c++':                'languages',
  'cpp':                'languages',
  'c#':                 'languages',
  'csharp':             'languages',
  'go':                 'languages',
  'golang':             'languages',
  'rust':               'languages',
  'kotlin':             'languages',
  'swift':              'languages',
  'ruby':               'languages',
  'php':                'languages',
  'scala':              'languages',
  'r':                  'languages',
  'matlab':             'languages',
  'dart':               'languages',
  'lua':                'languages',
  'perl':               'languages',
  'haskell':            'languages',
  'elixir':             'languages',
  'julia':              'languages',
  'shell':              'languages',
  'bash':               'languages',
  'powershell':         'languages',
  'groovy':             'languages',
  'solidity':           'languages',
  'sql':                'languages',

  // ── Frontend ───────────────────────────────────────────────────────────
  'react':              'frontend',
  'reactjs':            'frontend',
  'react.js':           'frontend',
  'next.js':            'frontend',
  'nextjs':             'frontend',
  'next':               'frontend',
  'vue':                'frontend',
  'vue.js':             'frontend',
  'vuejs':              'frontend',
  'nuxt':               'frontend',
  'nuxt.js':            'frontend',
  'angular':            'frontend',
  'angularjs':          'frontend',
  'svelte':             'frontend',
  'sveltekit':          'frontend',
  'solid.js':           'frontend',
  'solidjs':            'frontend',
  'remix':              'frontend',
  'gatsby':             'frontend',
  'redux':              'frontend',
  'zustand':            'frontend',
  'recoil':             'frontend',
  'mobx':               'frontend',
  'jotai':              'frontend',
  'react query':        'frontend',
  'tanstack query':     'frontend',
  'swr':                'frontend',
  'tailwind':           'frontend',
  'tailwind css':       'frontend',
  'tailwindcss':        'frontend',
  'bootstrap':          'frontend',
  'material ui':        'frontend',
  'mui':                'frontend',
  'chakra ui':          'frontend',
  'ant design':         'frontend',
  'antd':               'frontend',
  'shadcn':             'frontend',
  'shadcn/ui':          'frontend',
  'radix ui':           'frontend',
  'styled components':  'frontend',
  'emotion':            'frontend',
  'css modules':        'frontend',
  'html':               'frontend',
  'css':                'frontend',
  'html5':              'frontend',
  'css3':               'frontend',
  'sass':               'frontend',
  'scss':               'frontend',
  'less':               'frontend',
  'webpack':            'frontend',
  'vite':               'frontend',
  'parcel':             'frontend',
  'rollup':             'frontend',
  'babel':              'frontend',
  'esbuild':            'frontend',
  'react native':       'frontend',
  'expo':               'frontend',
  'flutter':            'frontend',
  'ionic':              'frontend',
  'framer motion':      'frontend',
  'gsap':               'frontend',
  'three.js':           'frontend',
  'threejs':            'frontend',
  'd3.js':              'frontend',
  'd3':                 'frontend',
  'chart.js':           'frontend',
  'axios':              'frontend',
  'fetch api':          'frontend',
  'pwa':                'frontend',
  'storybook':          'frontend',

  // ── Backend ────────────────────────────────────────────────────────────
  'node.js':            'backend',
  'nodejs':             'backend',
  'node':               'backend',
  'express':            'backend',
  'express.js':         'backend',
  'expressjs':          'backend',
  'fastapi':            'backend',
  'django':             'backend',
  'flask':              'backend',
  'fastify':            'backend',
  'nestjs':             'backend',
  'nest.js':            'backend',
  'hono':               'backend',
  'spring boot':        'backend',
  'spring':             'backend',
  'laravel':            'backend',
  'rails':              'backend',
  'ruby on rails':      'backend',
  'asp.net':            'backend',
  'dotnet':             'backend',
  '.net':               'backend',
  'gin':                'backend',
  'fiber':              'backend',
  'actix':              'backend',
  'axum':               'backend',
  'rest':               'backend',
  'rest api':           'backend',
  'rest apis':          'backend',
  'restful':            'backend',
  'restful apis':       'backend',
  'restful api':        'backend',
  'graphql':            'backend',
  'grpc':               'backend',
  'websockets':         'backend',
  'websocket':          'backend',
  'socket.io':          'backend',
  'socketio':           'backend',
  'jwt':                'backend',
  'json web tokens':    'backend',
  'oauth':              'backend',
  'oauth 2.0':          'backend',
  'passport.js':        'backend',
  'passportjs':         'backend',
  'kafka':              'backend',
  'rabbitmq':           'backend',
  'celery':             'backend',
  'bull':               'backend',
  'bullmq':             'backend',
  'redis pub/sub':      'backend',
  'trpc':               'backend',
  'multer':             'backend',
  'zod':                'backend',
  'yup':                'backend',

  // ── Databases ──────────────────────────────────────────────────────────
  'mongodb':            'databases',
  'mysql':              'databases',
  'postgresql':         'databases',
  'postgres':           'databases',
  'sqlite':             'databases',
  'mariadb':            'databases',
  'oracle':             'databases',
  'mssql':              'databases',
  'redis':              'databases',
  'memcached':          'databases',
  'firebase':           'databases',
  'firestore':          'databases',
  'supabase':           'databases',
  'planetscale':        'databases',
  'cockroachdb':        'databases',
  'cassandra':          'databases',
  'dynamodb':           'databases',
  'neo4j':              'databases',
  'arangodb':           'databases',
  'elasticsearch':      'databases',
  'opensearch':         'databases',
  'prisma':             'databases',
  'mongoose':           'databases',
  'sequelize':          'databases',
  'typeorm':            'databases',
  'drizzle':            'databases',
  'sqlalchemy':         'databases',
  'knex':               'databases',
  'realm':              'databases',

  // ── AI & LLM ───────────────────────────────────────────────────────────
  'gemini':             'aiLlm',
  'gemini api':         'aiLlm',
  'google gemini':      'aiLlm',
  'google gemini api':  'aiLlm',
  'openai':             'aiLlm',
  'openai api':         'aiLlm',
  'chatgpt':            'aiLlm',
  'gpt':                'aiLlm',
  'gpt-4':              'aiLlm',
  'gpt-3.5':            'aiLlm',
  'anthropic':          'aiLlm',
  'claude':             'aiLlm',
  'langchain':          'aiLlm',
  'llamaindex':         'aiLlm',
  'llama index':        'aiLlm',
  'rag':                'aiLlm',
  'retrieval augmented generation': 'aiLlm',
  'pinecone':           'aiLlm',
  'weaviate':           'aiLlm',
  'chromadb':           'aiLlm',
  'qdrant':             'aiLlm',
  'huggingface':        'aiLlm',
  'hugging face':       'aiLlm',
  'tensorflow':         'aiLlm',
  'pytorch':            'aiLlm',
  'keras':              'aiLlm',
  'scikit-learn':       'aiLlm',
  'sklearn':            'aiLlm',
  'transformers':       'aiLlm',
  'diffusers':          'aiLlm',
  'stable diffusion':   'aiLlm',
  'whisper':            'aiLlm',
  'ollama':             'aiLlm',
  'mistral':            'aiLlm',
  'llamafile':          'aiLlm',
  'groq':               'aiLlm',
  'vertex ai':          'aiLlm',
  'bedrock':            'aiLlm',
  'cohere':             'aiLlm',
  'vector database':    'aiLlm',
  'vector db':          'aiLlm',
  'embeddings':         'aiLlm',
  'semantic search':    'aiLlm',
  'fine-tuning':        'aiLlm',
  'prompt engineering': 'aiLlm',

  // ── Cloud & DevOps ─────────────────────────────────────────────────────
  'aws':                'cloudDevOps',
  'amazon web services':'cloudDevOps',
  'gcp':                'cloudDevOps',
  'google cloud':       'cloudDevOps',
  'google cloud platform': 'cloudDevOps',
  'azure':              'cloudDevOps',
  'microsoft azure':    'cloudDevOps',
  'docker':             'cloudDevOps',
  'kubernetes':         'cloudDevOps',
  'k8s':                'cloudDevOps',
  'terraform':          'cloudDevOps',
  'ansible':            'cloudDevOps',
  'pulumi':             'cloudDevOps',
  'helm':               'cloudDevOps',
  'github actions':     'cloudDevOps',
  'gitlab ci':          'cloudDevOps',
  'gitlab ci/cd':       'cloudDevOps',
  'ci/cd':              'cloudDevOps',
  'jenkins':            'cloudDevOps',
  'circle ci':          'cloudDevOps',
  'travis ci':          'cloudDevOps',
  'nginx':              'cloudDevOps',
  'apache':             'cloudDevOps',
  'caddy':              'cloudDevOps',
  'vercel':             'cloudDevOps',
  'netlify':            'cloudDevOps',
  'render':             'cloudDevOps',
  'heroku':             'cloudDevOps',
  'fly.io':             'cloudDevOps',
  'railway':            'cloudDevOps',
  'digitalocean':       'cloudDevOps',
  'linode':             'cloudDevOps',
  'cloudflare':         'cloudDevOps',
  'aws ec2':            'cloudDevOps',
  'aws s3':             'cloudDevOps',
  'aws lambda':         'cloudDevOps',
  'aws rds':            'cloudDevOps',
  'aws cloudwatch':     'cloudDevOps',
  'linux':              'cloudDevOps',
  'ubuntu':             'cloudDevOps',
  'centos':             'cloudDevOps',
  'prometheus':         'cloudDevOps',
  'grafana':            'cloudDevOps',
  'datadog':            'cloudDevOps',
  'sentry':             'cloudDevOps',
  'cloudinary':         'cloudDevOps',

  // ── Developer Tools ────────────────────────────────────────────────────
  'git':                'developerTools',
  'github':             'developerTools',
  'gitlab':             'developerTools',
  'bitbucket':          'developerTools',
  'vs code':            'developerTools',
  'vscode':             'developerTools',
  'visual studio code': 'developerTools',
  'intellij':           'developerTools',
  'intellij idea':      'developerTools',
  'pycharm':            'developerTools',
  'webstorm':           'developerTools',
  'postman':            'developerTools',
  'insomnia':           'developerTools',
  'jest':               'developerTools',
  'vitest':             'developerTools',
  'mocha':              'developerTools',
  'chai':               'developerTools',
  'cypress':            'developerTools',
  'playwright':         'developerTools',
  'supertest':          'developerTools',
  'pytest':             'developerTools',
  'junit':              'developerTools',
  'figma':              'developerTools',
  'jira':               'developerTools',
  'confluence':         'developerTools',
  'notion':             'developerTools',
  'linear':             'developerTools',
  'npm':                'developerTools',
  'yarn':               'developerTools',
  'pnpm':               'developerTools',
  'pip':                'developerTools',
  'poetry':             'developerTools',
  'swagger':            'developerTools',
  'openapi':            'developerTools',
  'eslint':             'developerTools',
  'prettier':           'developerTools',
  'linux cli':          'developerTools',
  'terminal':           'developerTools',
  'vim':                'developerTools',
  'neovim':             'developerTools',
  'tmux':               'developerTools',

  // ── Core Concepts ──────────────────────────────────────────────────────
  'data structures':                   'coreConcepts',
  'algorithms':                        'coreConcepts',
  'data structures & algorithms':      'coreConcepts',
  'data structures and algorithms':    'coreConcepts',
  'dsa':                               'coreConcepts',
  'oop':                               'coreConcepts',
  'object oriented programming':       'coreConcepts',
  'object-oriented programming':       'coreConcepts',
  'system design':                     'coreConcepts',
  'dbms':                              'coreConcepts',
  'database management systems':       'coreConcepts',
  'operating systems':                 'coreConcepts',
  'os':                                'coreConcepts',
  'computer networks':                 'coreConcepts',
  'cn':                                'coreConcepts',
  'networking':                        'coreConcepts',
  'authentication':                    'coreConcepts',
  'authorization':                     'coreConcepts',
  'authentication & authorization':    'coreConcepts',
  'rbac':                              'coreConcepts',
  'role based access control':         'coreConcepts',
  'role-based access control':         'coreConcepts',
  'mvc':                               'coreConcepts',
  'model view controller':             'coreConcepts',
  'microservices':                     'coreConcepts',
  'monolithic architecture':           'coreConcepts',
  'event driven architecture':         'coreConcepts',
  'agile':                             'coreConcepts',
  'scrum':                             'coreConcepts',
  'solid principles':                  'coreConcepts',
  'solid':                             'coreConcepts',
  'design patterns':                   'coreConcepts',
  'clean code':                        'coreConcepts',
  'tdd':                               'coreConcepts',
  'test driven development':           'coreConcepts',
  'bdd':                               'coreConcepts',
  'api design':                        'coreConcepts',
  'distributed systems':               'coreConcepts',
  'concurrency':                       'coreConcepts',
  'multithreading':                    'coreConcepts',
  'memory management':                 'coreConcepts',
  'caching':                           'coreConcepts',
  'load balancing':                    'coreConcepts',
  'message queues':                    'coreConcepts',
  'event sourcing':                    'coreConcepts',
  'cqrs':                              'coreConcepts',
  'functional programming':            'coreConcepts',
  'reactive programming':              'coreConcepts',
  'compiler design':                   'coreConcepts',
  'cryptography':                      'coreConcepts',
};

// ---------------------------------------------------------------------------
// Normalizer: convert any input form to the canonical lookup key
// Handles: "React.js" → "react", "Node JS" → "node js", "REST APIs" → "rest apis"
// ---------------------------------------------------------------------------
function normalize(skill) {
  return skill
    .toLowerCase()
    .replace(/[^\w\s.#/+]/g, ' ')   // keep . # / + intact (c++, c#, .net, node.js, etc.)
    .replace(/\s+/g, ' ')
    .trim();
}

class SkillClassifier {
  /**
   * Classify a flat array of skill strings into canonical buckets.
   * Every skill is either mapped to a bucket or falls into 'technologies'.
   * Skills are never discarded.
   *
   * @param {string[]} skillList - Raw skill names as extracted by AI
   * @returns {Object} - { languages: [{value, confidence}], frontend: [...], ... }
   */
  classify(skillList) {
    const buckets = Object.fromEntries(CANONICAL_BUCKETS.map(k => [k, []]));
    const seen = new Set();

    for (const raw of skillList) {
      if (!raw || typeof raw !== 'string') continue;
      const trimmed = raw.trim();
      if (!trimmed) continue;

      const key = normalize(trimmed);
      if (seen.has(key)) continue;
      seen.add(key);

      const bucket = SKILL_MAP[key] ?? this._fuzzyMatch(key) ?? 'technologies';
      buckets[bucket].push({ value: trimmed, confidence: 1 });
    }

    return buckets;
  }

  /**
   * Re-classify skills already stored in bucket format (handles all legacy taxonomy versions).
   * Collects every skill from any bucket and runs them through classify().
   * This ensures legacy resumes are upgraded without losing a single skill.
   *
   * @param {Object} existingSkills - The skills object from structuredData (any historical format)
   * @returns {Object} - Newly classified buckets
   */
  reclassify(existingSkills) {
    if (!existingSkills) return Object.fromEntries(CANONICAL_BUCKETS.map(k => [k, []]));
    const flat = [];
    for (const val of Object.values(existingSkills)) {
      if (Array.isArray(val)) {
        flat.push(...val.map(item =>
          typeof item === 'string' ? item : (item?.value ?? '')
        ).filter(Boolean));
      }
    }
    return this.classify(flat);
  }

  /**
   * Fuzzy match: try to find a mapping for partial / compound terms.
   * e.g. "AWS EC2 Auto Scaling" → cloudDevOps (because "aws ec2" is a prefix match)
   */
  _fuzzyMatch(key) {
    // Exact prefix match against known map keys
    for (const [mapKey, bucket] of Object.entries(SKILL_MAP)) {
      if (key.startsWith(mapKey + ' ') || mapKey.startsWith(key + ' ')) {
        return bucket;
      }
    }
    // Substring match (less precise, used as last resort)
    for (const [mapKey, bucket] of Object.entries(SKILL_MAP)) {
      if (mapKey.length > 3 && key.includes(mapKey)) {
        return bucket;
      }
    }
    return null;
  }

  /**
   * For rendering: merge any bucket with fewer than MIN_BUCKET_SIZE items
   * into the 'technologies' fallback bucket, keeping the section compact.
   * The original classified data is NOT modified — this is view-only.
   *
   * @param {Object} classifiedSkills - Result of classify() or reclassify()
   * @returns {Object} - Compacted buckets safe for rendering
   */
  compactForDisplay(classifiedSkills) {
    const result = Object.fromEntries(CANONICAL_BUCKETS.map(k => [k, []]));
    const overflow = [];

    for (const bucket of CANONICAL_BUCKETS) {
      if (bucket === 'technologies') continue;
      const items = classifiedSkills[bucket] ?? [];
      if (items.length >= MIN_BUCKET_SIZE) {
        result[bucket] = items;
      } else {
        overflow.push(...items);
      }
    }

    // Merge thin buckets + existing technologies overflow
    result.technologies = [
      ...(classifiedSkills.technologies ?? []),
      ...overflow,
    ];

    // Drop empty 'technologies' bucket from result if truly empty
    if (result.technologies.length === 0) {
      delete result.technologies;
    }

    return result;
  }

  getBucketLabel(key) {
    return BUCKET_LABELS[key] ?? key;
  }
}

export const skillClassifier = new SkillClassifier();
export default skillClassifier;
