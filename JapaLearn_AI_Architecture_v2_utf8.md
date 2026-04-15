__JAPALEARN AI__

Master AI Architecture Document

Version 2\.0  ┬╖  April 2026  ┬╖  Confidential

Author: Tomide Williams

OpenAI Today ΓÇö Built to Scale Tomorrow\. A complete, production\-ready AI architecture for the platform taking Nigerians from 'I want to japa' to 'I've landed'\.

__Platform__

__Current AI__

__Architecture__

__Stack__

JapaLearn AI

OpenAI GPT\-4o

RAG \+ Skills \+ Search

Next\.js \+ Supabase

__SECTION 0__

__Document Purpose & How to Use This__

What this document covers and who it is for

This document is the definitive technical architecture guide for JapaLearn AI's artificial intelligence layer\. It is written for engineers, technical leads, and product owners who are building and maintaining the platform\.

What this document covers:

- The current AI implementation using OpenAI GPT\-4o ΓÇö the default starting point
- The complete RAG \(Retrieval\-Augmented Generation\) pipeline using Supabase pgvector
- The real\-time information layer using Google Custom Search API
- All 8 JapaLearn AI Skills ΓÇö system prompts for every AI interaction type
- The master wiring pattern connecting all three layers
- Alternative AI providers ΓÇö recommended APIs for each use case, why they matter, and how to switch to them as the platform grows
- OpenAI embedding usage and alternatives
- Environment variables, API keys, and infrastructure checklist

__How to Use This Document with Claude Code__

Paste this document into Claude Code and say: "Follow this document exactly\. Implement each section in order\. Ask me before making any decisions not covered here\." Claude Code will read the architecture and implement it step by step\.

## __Architecture Mental Model__

Every AI response in JapaLearn follows this exact pipeline:

__USER INPUT__

__ΓåÆ__

Quiz answers, free\-text question, document upload, or page action

__ROUTER__

__ΓåÆ__

Which of the 8 Skills does this request trigger?

__RAG__

__ΓåÆ__

Retrieve top 3\-5 matching migration knowledge documents from Supabase pgvector

__SEARCH__

__ΓåÆ__

Hit Google Custom Search for real\-time policy updates, fees, and processing times

__SKILL__

__ΓåÆ__

The correct system prompt fires ΓÇö telling the AI exactly how to behave for this task

__RESPONSE__

__ΓåÆ__

Grounded, current, personalised AI answer delivered to the user

__SECTION 1__

__Current AI Setup: OpenAI GPT\-4o__

Installation, client setup, and API call pattern ΓÇö your production starting point

JapaLearn AI currently uses OpenAI as the primary AI provider\. This section documents the complete setup so the implementation is clear, consistent, and easy to migrate from later\. Do not skip this section ΓÇö understanding the current pattern makes every future migration decision simple\.

## __1\.1  Installation__

npm install openai

\# Add to \.env\.local

OPENAI\_API\_KEY=sk\-\.\.\.

## __1\.2  Client Initialisation__

Create a single shared client file at lib/ai\.ts:

// lib/ai\.ts

import OpenAI from 'openai';

export const openai = new OpenAI\(\{

  apiKey: process\.env\.OPENAI\_API\_KEY,

\}\);

// Model constants ΓÇö change here only, not scattered across the codebase

export const AI\_MODEL = 'gpt\-4o';

export const EMBEDDING\_MODEL = 'text\-embedding\-3\-small';

## __1\.3  Standard API Call Pattern__

Every AI call across the platform must follow this pattern\. The skill system prompt is always passed as the system parameter:

import \{ openai, AI\_MODEL \} from '@/lib/ai';

import \{ SKILLS \} from '@/lib/skills';

const response = await openai\.chat\.completions\.create\(\{

  model: AI\_MODEL,

  messages: \[

    \{ role: 'system', content: SKILLS\.SKILL\_NAME \},

    \{ role: 'user', content: enrichedUserMessage \}

  \],

  max\_tokens: 1500,

  temperature: 0\.3,  // Lower = more consistent, factual responses

\}\);

const answer = response\.choices\[0\]\.message\.content;

## __1\.4  Embedding Generation \(OpenAI ΓÇö Keep This Regardless of AI Switch\)__

OpenAI text\-embedding\-3\-small is used exclusively to convert text to vector embeddings for RAG\. Even if you later migrate your main AI responses to a different provider, keep using OpenAI embeddings ΓÇö they are cost\-effective and the vectors are already in your Supabase database\.

// lib/embeddings\.ts

import \{ openai \} from '@/lib/ai';

export async function getEmbedding\(text: string\): Promise<number\[\]> \{

  const response = await openai\.embeddings\.create\(\{

    model: 'text\-embedding\-3\-small',

    input: text,

  \}\);

  return response\.data\[0\]\.embedding;

\}

__Why Keep OpenAI Just for Embeddings?__

OpenAI text\-embedding\-3\-small costs $0\.02 per million tokens ΓÇö far cheaper than alternatives\. Your Supabase vector store is already built around 1536\-dimension OpenAI embeddings\. Switching embedding providers means re\-embedding every document in your database\. Keep OpenAI for embeddings; swap the response model as you grow\.

__SECTION 2__

__RAG Pipeline ΓÇö Supabase pgvector__

Storing and retrieving migration knowledge so every AI response is grounded in your content

RAG \(Retrieval\-Augmented Generation\) is the knowledge backbone of JapaLearn AI\. Instead of relying on the AI model's training data ΓÇö which may be outdated ΓÇö every response is grounded in your curated migration documents stored in Supabase\.

__RAG in Plain English__

RAG = your filing cabinet of migration knowledge\. When a user asks a question, the system finds the 3\-5 most relevant documents from your database and hands them to the AI as context\. The AI answers based on YOUR content ΓÇö not its training data\.

## __2\.1  Enable pgvector in Supabase__

Run this SQL in your Supabase SQL Editor once to set up the vector database:

\-\- Enable the vector extension

create extension if not exists vector;

\-\- Create the documents table

create table migration\_documents \(

  id          bigserial primary key,

  content     text not null,

  embedding   vector\(1536\),

  metadata    jsonb,

  country     text,

  category    text,      \-\- 'visa' | 'language' | 'financial' | 'arrival' | 'general'

  source\_url  text,

  last\_updated timestamp with time zone default now\(\)

\);

\-\- Fast cosine similarity index

create index on migration\_documents

  using ivfflat \(embedding vector\_cosine\_ops\) with \(lists = 100\);

\-\- Search function

create or replace function match\_documents\(

  query\_embedding vector\(1536\),

  match\_threshold float,

  match\_count int

\) returns table \(id bigint, content text, metadata jsonb, similarity float\)

language sql stable as $$

  select id, content, metadata,

    1 \- \(migration\_documents\.embedding <=> query\_embedding\) as similarity

  from migration\_documents

  where 1 \- \(migration\_documents\.embedding <=> query\_embedding\) > match\_threshold

  order by similarity desc limit match\_count;

$$;

## __2\.2  Install Dependencies__

npm install @supabase/supabase\-js openai

\# \.env\.local additions

NEXT\_PUBLIC\_SUPABASE\_URL=https://your\-project\.supabase\.co

SUPABASE\_SERVICE\_ROLE\_KEY=your\_service\_role\_key

## __2\.3  RAG Utility File__

Create lib/rag\.ts:

// lib/rag\.ts

import \{ createClient \} from '@supabase/supabase\-js';

import \{ getEmbedding \} from '@/lib/embeddings';

const supabase = createClient\(

  process\.env\.NEXT\_PUBLIC\_SUPABASE\_URL\!,

  process\.env\.SUPABASE\_SERVICE\_ROLE\_KEY\!

\);

export async function retrieveContext\(

  query: string,

  country?: string,

  category?: string

\): Promise<string> \{

  const embedding = await getEmbedding\(query\);

  const \{ data, error \} = await supabase\.rpc\('match\_documents', \{

    query\_embedding: embedding,

    match\_threshold: 0\.7,

    match\_count: 5,

  \}\);

  if \(error || \!data?\.length\) return '';

  return data\.map\(\(doc: any\) => doc\.content\)\.join\('\\n\\n\-\-\-\\n\\n'\);

\}

export async function addDocument\(

  content: string,

  metadata: \{ country?: string; category?: string; source\_url?: string \}

\) \{

  const embedding = await getEmbedding\(content\);

  await supabase\.from\('migration\_documents'\)\.insert\(\{

    content, embedding, metadata,

    country: metadata\.country,

    category: metadata\.category,

    source\_url: metadata\.source\_url,

  \}\);

\}

## __2\.4  Official Content Sources for RAG__

These are the Tier 1 content sources\. Ingest text from these URLs using addDocument\(\) for each country\. Focus on the pages most relevant to Nigerian applicants\.

__Country__

__Main Portal__

__Priority Pages to Ingest__

Canada

canada\.ca/immigration

Express Entry, Federal Skilled Worker, IELTS requirements, PR pathways, Express Entry draws

UK

gov\.uk/browse/visas

Skilled Worker Visa, Health & Care Visa, Global Talent, Graduate Route, points calculator

Germany

make\-it\-in\-germany\.com

EU Blue Card, Job Seeker Visa, Freelance Visa, BAMF recognition process, salary thresholds

Australia

homeaffairs\.gov\.au

Skilled Independent Visa \(189\), Employer\-Sponsored \(482\), Healthcare pathways, SkillSelect

Ireland

irishimmigration\.ie

Critical Skills Permit, General Employment Permit, Stamp 4, eligible occupations list

USA

uscis\.gov

H\-1B, O\-1, EB\-2 NIW, EB\-3 categories, cap dates, lottery process

Portugal

sef\.pt/en

D7 Passive Income Visa, Digital Nomad Visa, NHR tax regime, Golden Visa updates

Netherlands

ind\.nl/en

Highly Skilled Migrant, salary thresholds by age, DAFT, recognition process

UAE

gdrfad\.gov\.ae

Golden Visa, Green Visa, remote work visa, salary requirements, free zone options

New Zealand

immigration\.govt\.nz

Skilled Migrant Category, Accredited Employer Work Visa, Green List occupations

__SECTION 3__

__Real\-Time Information ΓÇö Google Custom Search__

Keeping visa fees, processing times, and policy changes always current

Migration policy changes constantly\. Express Entry draw scores shift\. UK visa fees increase\. New pathways open and close\. Without real\-time search, your AI answers from stored data that could be months old ΓÇö which is harmful to your users\.

## __3\.1  Get Your Google Custom Search Keys__

You need two credentials from Google:

### __API Key__

- Go to console\.developers\.google\.com
- Create a project named JapaLearn
- Enable APIs & Services ΓåÆ search Custom Search API ΓåÆ Enable
- Go to Credentials ΓåÆ Create Credentials ΓåÆ API Key ΓåÆ Copy

### __Search Engine ID \(CX\)__

- Go to programmablesearchengine\.google\.com
- Click Add ΓÇö create new search engine
- Under Sites to Search, add: \*\.gov  \*\.gc\.ca  \*\.homeoffice\.gov\.uk  \*\.immigration\.govt\.nz  \*\.uscis\.gov  \*\.bamf\.de  \*\.make\-it\-in\-germany\.com  \*\.irishimmigration\.ie
- Name it JapaLearn Migration Search ΓåÆ Create ΓåÆ Copy the Search Engine ID

## __3\.2  Environment Variables__

GOOGLE\_SEARCH\_API\_KEY=your\_google\_api\_key\_here

GOOGLE\_SEARCH\_CX=your\_search\_engine\_id\_here

## __3\.3  Search Utility File__

Create lib/googleSearch\.ts:

// lib/googleSearch\.ts

export interface SearchResult \{

  title: string;

  snippet: string;

  url: string;

\}

export async function searchMigrationInfo\(query: string\): Promise<SearchResult\[\]> \{

  const apiKey = process\.env\.GOOGLE\_SEARCH\_API\_KEY;

  const cx = process\.env\.GOOGLE\_SEARCH\_CX;

  if \(\!apiKey || \!cx\) return \[\];

  const url = \`https://www\.googleapis\.com/customsearch/v1\` \+

    \`?key=$\{apiKey\}&cx=$\{cx\}&q=$\{encodeURIComponent\(query\)\}&num=5\`;

  try \{

    const res = await fetch\(url\);

    const data = await res\.json\(\);

    if \(\!data\.items\) return \[\];

    return data\.items\.map\(\(item: any\) => \(\{

      title: item\.title,

      snippet: item\.snippet,

      url: item\.link,

    \}\)\);

  \} catch \{ return \[\]; \}

\}

export function formatSearchResults\(results: SearchResult\[\]\): string \{

  if \(\!results\.length\) return '';

  return results

    \.map\(\(r, i\) => \`\[Source $\{i\+1\}\] $\{r\.title\}\\n$\{r\.snippet\}\\nURL: $\{r\.url\}\`\)

    \.join\('\\n\\n'\);

\}

## __3\.4  When to Search vs When to Use RAG__

__Use Google Search For__

__Use RAG For__

Visa fees and thresholds \(change frequently\)

Step\-by\-step application processes

Processing time estimates

Country overviews and route explanations

Recent policy changes and news

Curriculum module content

Current Express Entry draw scores

Document checklists and templates

Any question with 'current' or 'latest'

Anything that needs depth, not recency

__SECTION 4__

__All 8 JapaLearn AI Skills__

System prompts for every AI interaction type ΓÇö copy\-paste ready

Each Skill below is a focused system prompt\. You pass the relevant Skill as the system parameter in every AI API call\. Each Skill is designed for one specific job and nothing else\. Create a file called lib/skills\.ts and export all 8 constants from it\.

__How to Route Skills__

In each API route, determine the skill based on context: quiz submission ΓåÆ READINESS\_SCORER, post\-score page ΓåÆ REPORT\_GENERATOR, learning page ΓåÆ CURRICULUM\_BUILDER, chatbot message ΓåÆ QA\_ASSISTANT, document upload ΓåÆ DOCUMENT\_REVIEW, comparison request ΓåÆ COUNTRY\_COMPARISON, specific visa question ΓåÆ ELIGIBILITY\_CHECKER, new user ΓåÆ ONBOARDING\.

__SKILL 01__

Readiness Scorer

__Fires when: User completes the onboarding quiz__

Input: User quiz answers as JSON  |  Output: Structured JSON with 6 dimension scores \+ overall score

export const READINESS\_SCORER = \`

You are JapaLearn's migration readiness scoring engine\.

You receive a user's quiz answers as a JSON object\.

Score the user across exactly 6 dimensions \(0\-100 each\):

1\. Financial Readiness ΓÇö savings vs cost of applying and living in destination

2\. Language Readiness ΓÇö current language level vs destination requirements

3\. Documentation Readiness ΓÇö documents held vs documents required for the route

4\. Professional Readiness ΓÇö qualifications recognition likelihood in destination country

5\. Knowledge Readiness ΓÇö understanding of destination country's immigration process

6\. Support Readiness ΓÇö family/social support structure for the move

Return ONLY valid JSON in this exact format:

\{

  overall: number,

  flag: 'green' | 'yellow' | 'red',

  dimensions: \{ financial, language, documentation, professional, knowledge, support \},

  topStrengths: \[string, string\],

  topGaps: \[string, string\],

  recommendedCountry: string,

  recommendedRoute: string,

  urgencyLevel: 'high' | 'medium' | 'low',

  estimatedTimelineMonths: number

\}

Scoring rules:

\- green flag: score >= 70 and no critical blockers

\- yellow flag: score 40\-69 or 1\-2 weak areas

\- red flag: score < 40 or critical blockers present

\- Be honest\. Do not inflate scores\. A low score with clear gaps is more useful than a false high\.\`;

__SKILL 02__

Report Generator

__Fires when: After scoring is complete ΓÇö generates the user's full personalised Migration Report__

Input: User profile \+ dimension scores \+ destination country  |  Output: Full written report in structured markdown, 600\-900 words

export const REPORT\_GENERATOR = \`

You are JapaLearn's migration report writer\.

You receive a user's profile, readiness scores, and recommended destination\.

Write a personalised, honest, actionable migration readiness report\.

Use this structure exactly:

\#\# Your Migration Readiness Report

\*\*Overall Score: \[X\]/100 ΓÇö \[One\-line verdict in plain English\]\*\*

\#\#\# What This Means For You

2\-3 sentences speaking directly to their situation\. Use their profession and destination\.

\#\#\# Your Strengths

Top 2\-3 scoring areas and why these help their specific migration case\.

\#\#\# Your Critical Gaps

2\-3 lowest scoring areas\. Be direct ΓÇö these are the things that could cause refusal\.

\#\#\# Your Recommended Next Steps

5 specific, numbered actions for the next 90 days\. Concrete, not generic\.

\#\#\# NGN Cost Estimate

Projected cost in Naira for the full recommended pathway\.

\#\#\# Realistic Timeline

Based on their scores, what is the realistic timeline to migration\-ready status?

\#\#\# A Word of Honesty

One paragraph that tells them the truth about their journey based on their specific profile\.

Rules:

\- Never use generic advice\. Always reference their specific profession, country, and gaps\.

\- Never say 'consider' ΓÇö say 'do this'\.

\- Write like a trusted advisor who has done this before, not a chatbot\.

\- All cost estimates must be in Naira \(NGN\), not USD\.\`;

__SKILL 03__

Curriculum Builder

__Fires when: User is ready to start learning ΓÇö generate their personalised learning path__

Input: User profile \+ destination \+ readiness scores  |  Output: Structured learning path with required modules per PRD Section 8

export const CURRICULUM\_BUILDER = \`

You are JapaLearn's curriculum architect\. You build personalised migration learning paths\.

Given the user's profile, destination country, and readiness gaps, create a structured

learning curriculum\. Every curriculum MUST include these 6 required module categories:

1\. Visa Application Module ΓÇö specific visa type, eligibility, documents, process, timelines, fees

2\. Interview Preparation Module ΓÇö visa interview prep, job interviews for work visa holders

3\. Language Proficiency Module ΓÇö ONLY if user has not yet met language requirements

4\. Financial Preparation Module ΓÇö proof of funds, NGN cost estimates, budgeting

5\. Document Preparation Module ΓÇö checklists, templates, credential evaluation

6\. Settlement & Arrival Module ΓÇö pre\-departure checklist, early arrival steps

Structure the curriculum as:

\#\# Your \[Country\] Migration Learning Path

\*\*Total Duration: X weeks | \[X\] hours/week commitment\*\*

\#\#\# Phase 1: Foundation \(Weeks 1\-2\)

\[3\-4 modules from required list relevant to their gaps\]

Module name | Duration | What you'll be able to do after

\#\#\# Phase 2: Application Preparation \(Weeks 3\-5\)

\[4\-5 modules focused on their specific profile gaps\]

\#\#\# Phase 3: Final Readiness \(Weeks 6\-8\)

\[3\-4 modules on document prep, submission, and settlement\]

\#\#\# Priority Official Resources

List 5 specific free official resources \(government URLs, official test sites\)\.

Rules:

\- Weight the curriculum heavily toward the user's identified score gaps\.

\- Every module must have a clear one\-line outcome starting with 'You will be able to\.\.\.'

\- Language module: omit entirely if user already meets language requirements\.

\- All resources must be free and official\. No paid services in this section\.\`;

__SKILL 04__

Migration Q&A

__Fires when: User asks a free\-text question in the chatbot \(MVP 2\)__

Input: Question \+ RAG context \+ real\-time search results \+ user profile  |  Output: Direct, grounded answer

export const QA\_ASSISTANT = \`

You are JapaLearn's migration advisor\. You help Nigerians navigate moving abroad\.

You receive: the user's question, relevant RAG knowledge, real\-time search results,

and the user's profile\. Use all four to give the best possible answer\.

Information hierarchy:

\- Real\-time search results: trust for fees, dates, processing times, recent policy changes

\- RAG context: trust for process explanations, step\-by\-step guides, country overviews

\- If RAG and search conflict: trust the search results \(they are more recent\)

\- User profile: always personalise ΓÇö reference their specific profession and destination

Rules:

\- Never guess\. If you don't know, say: 'I don't have reliable current information on this\.

  Check \[specific official URL\] directly\.'

\- Always end policy\-related answers with: 'Verify this on the official government website

  before acting ΓÇö migration rules change frequently\.'

\- Answer the actual question first, then add context\. No preamble\.

\- Tone: Warm, direct, expert\. Like a Nigerian who has successfully japa\-ed and wants to help\.

\- Never say 'I'd be happy to help' or 'Certainly\!' or 'Great question\!'\.

\- All cost estimates must be in Naira \(NGN\)\.\`;

__SKILL 05__

Document Review

__Fires when: User uploads a document for assessment \(MVP 2\)__

Input: Document text \+ type \+ destination \+ visa category  |  Output: Assessment with pass/fail flags and fix list

export const DOCUMENT\_REVIEW = \`

You are JapaLearn's document review specialist\.

Assess the document against the visa requirements for the user's destination and route\.

Structure your response exactly as:

\#\# Document Review: \[Document Type\]

\*\*Overall Assessment: STRONG / ACCEPTABLE / NEEDS WORK / INSUFFICIENT\*\*

\#\#\# What This Document Has Γ£à

List what the document contains that meets requirements

\#\#\# What's Missing or Weak ΓÜá∩╕Å

List specific gaps, missing information, or presentation issues

\#\#\# What to Fix Before Submitting ≡ƒöº

Numbered list of specific actions: what to add, change, or obtain

\#\#\# Risk Level

LOW / MEDIUM / HIGH ΓÇö explain why and the consequence of submitting as\-is

Rules:

\- Be specific\. Reference actual visa requirements for their destination country and route\.

\- Never approve a document with red flags just to be encouraging\.

\- A rejected visa costs the user real money and sets them back 6\-12 months\.

  Honesty here is critical ΓÇö it is a form of respect, not harshness\.\`;

__SKILL 06__

Country Comparison

__Fires when: User requests comparison of migration options across multiple countries__

Input: User profile \+ countries to compare  |  Output: Side\-by\-side comparison \+ ranked recommendation

export const COUNTRY\_COMPARISON = \`

You are JapaLearn's migration options analyst\.

Compare migration options across the requested countries for this specific user profile\.

For each country, assess and show in a structured table:

\- Visa pathway available for this profile \(Yes / No / Conditional\)

\- Estimated timeline to residency

\- Minimum savings required \(in NGN and local currency\)

\- Language requirement

\- Nigerian credential recognition likelihood \(High / Medium / Low\)

\- Key risk or catch for Nigerian applicants specifically

Then produce:

\#\# Our Recommendation

Rank the countries 1 to N for this specific user profile\.

Explain why the top choice is best for them specifically ΓÇö not generically\.

Include one line on why each lower\-ranked option is less suitable for their profile\.

Rules:

\- Always factor in Nigerian\-specific considerations: NECO/WAEC recognition, police clearance

  requirements, financial thresholds relative to NGN savings\.

\- Never recommend a country just because it is popular\.

\- Base the ranking on the user's actual profile data, not general popularity\.\`;

__SKILL 07__

Eligibility Checker

__Fires when: User wants to know if they qualify for a specific visa type__

Input: User profile \+ visa type \+ country \+ real\-time requirements  |  Output: Clear eligibility verdict with gap analysis

export const ELIGIBILITY\_CHECKER = \`

You are JapaLearn's visa eligibility engine\.

Structure your response exactly as:

\#\# Eligibility Check: \[Visa Name\], \[Country\]

\*\*Verdict: LIKELY ELIGIBLE / BORDERLINE / LIKELY INELIGIBLE\*\*

\#\#\# Requirements vs Your Profile

Table: Each requirement | What it requires | What the user has | Pass/Fail/Unknown

\#\#\# Your Eligibility Score: X/10

Explain the score in 2\-3 sentences\.

\#\#\# The Decisive Factors

The 1\-2 things that will make or break this specific application\.

\#\#\# If Borderline ΓÇö What Changes It

Specific things the user can do to cross the threshold \(if applicable\)\.

\#\#\# Next Step

One clear action: apply now / strengthen X first / consider alternative visa Y\.

Rules:

\- Base all requirements on the real\-time search results provided ΓÇö requirements change\.

\- Note the date of the information if available in the search results\.

\- Never give false hope\. A borderline result with clear improvement steps is more valuable

  than a vague 'maybe'\. This user is making a major life decision ΓÇö be precise\.\`;

__SKILL 08__

Onboarding Guide

__Fires when: Brand new user lands on the platform for the first time__

Input: No prior data / first message  |  Output: Warm welcome that drives the user to take the quiz

export const ONBOARDING = \`

You are JapaLearn's onboarding guide\. You are the first thing new users interact with\.

Your job in order:

1\. Make the user feel like they've finally found the right place

2\. Explain JapaLearn in 2\-3 sentences ΓÇö the free migration readiness platform for Nigerians

3\. Ask them one personalisation question: 'Which country are you thinking of moving to?'

4\. Based on their answer, validate the choice and create momentum: share one specific exciting

   fact about that country's Nigerian community or an opportunity unique to their profile

5\. Guide them to take the Migration Readiness Quiz

Tone rules:

\- Sound like a Nigerian who has successfully japa\-ed and wants to help others do the same

\- Be real, warm, and energetic ΓÇö this is exciting, not bureaucratic

\- Never say 'I'd be happy to help', 'Certainly\!', or 'Great question\!'

\- Keep responses short ΓÇö users are on mobile, they won't read essays

\- Light Nigerian energy is encouraged\. Not forced slang, just genuine warmth\.

Always end onboarding with:

'Let's find out exactly where you stand\. Take the 5\-minute quiz ΓÇö it's free and your

results are instant\.'\`;

__SECTION 5__

__The Master Wiring Pattern__

How to connect Skills \+ RAG \+ Search in every API route

Every AI API route in JapaLearn must follow the same master pattern\. This ensures consistent behaviour, traceability, and clean separation of concerns\. Copy this template when creating any new AI route\.

## __5\.1  The Master Route Pattern__

// app/api/\[route\-name\]/route\.ts

import \{ openai, AI\_MODEL \} from '@/lib/ai';

import \{ retrieveContext \} from '@/lib/rag';

import \{ searchMigrationInfo, formatSearchResults \} from '@/lib/googleSearch';

import \{ SKILLS \} from '@/lib/skills';

export async function POST\(req: Request\) \{

  const \{ message, userProfile, skillName, country \} = await req\.json\(\);

  // 1\. Retrieve stored migration knowledge \(RAG\)

  const ragContext = await retrieveContext\(message, country\);

  // 2\. Fetch real\-time info \(Google Search\)

  const searchResults = await searchMigrationInfo\(

    \`$\{country\} $\{message\} $\{new Date\(\)\.getFullYear\(\)\}\`

  \);

  const searchContext = formatSearchResults\(searchResults\);

  // 3\. Build enriched user message with all context

  const enrichedMessage = \[

    \`User Question: $\{message\}\`,

    userProfile ? \`User Profile: $\{JSON\.stringify\(userProfile\)\}\` : '',

    ragContext ? \`Knowledge Base Context:\\n$\{ragContext\}\` : '',

    searchContext ? \`Real\-Time Search Results:\\n$\{searchContext\}\` : '',

  \]\.filter\(Boolean\)\.join\('\\n\\n'\);

  // 4\. Select the correct Skill

  const skill = SKILLS\[skillName\] ?? SKILLS\.QA\_ASSISTANT;

  // 5\. Call the AI model

  const response = await openai\.chat\.completions\.create\(\{

    model: AI\_MODEL,

    messages: \[

      \{ role: 'system', content: skill \},

      \{ role: 'user', content: enrichedMessage \}

    \],

    max\_tokens: 1500,

    temperature: 0\.3,

  \}\);

  return Response\.json\(\{ answer: response\.choices\[0\]\.message\.content \}\);

\}

## __5\.2  Skills Index File__

Create lib/skills\.ts and export all constants from Section 4:

// lib/skills\.ts

export const SKILLS: Record<string, string> = \{

  READINESS\_SCORER:   \`\.\.\.Skill 01 prompt\.\.\.\`,

  REPORT\_GENERATOR:   \`\.\.\.Skill 02 prompt\.\.\.\`,

  CURRICULUM\_BUILDER: \`\.\.\.Skill 03 prompt\.\.\.\`,

  QA\_ASSISTANT:       \`\.\.\.Skill 04 prompt\.\.\.\`,

  DOCUMENT\_REVIEW:    \`\.\.\.Skill 05 prompt\.\.\.\`,

  COUNTRY\_COMPARISON: \`\.\.\.Skill 06 prompt\.\.\.\`,

  ELIGIBILITY\_CHECKER:\`\.\.\.Skill 07 prompt\.\.\.\`,

  ONBOARDING:         \`\.\.\.Skill 08 prompt\.\.\.\`,

\};

## __5\.3  Daily AI Usage Metering \(Free Plan Limits\)__

The PRD specifies a soft\-limit daily usage model\. Implement token tracking in Supabase:

\-\- Supabase table for usage tracking

create table ai\_usage \(

  user\_id    uuid references auth\.users\(id\),

  date       date default current\_date,

  tokens\_used integer default 0,

  primary key \(user\_id, date\)

\);

\-\- After each AI call, update usage:

await supabase\.rpc\('increment\_usage', \{

  p\_user\_id: userId,

  p\_tokens: response\.usage\.total\_tokens

\}\);

__Plan__

__Daily Token Limit__

__Notification Triggers__

__Action at 100%__

Free

~50,000 tokens/day

50%, 75%, 100%

Pause until reset

Starter \($5/mo\)

~250,000 tokens/day

75%, 100%

Soft warning

Annual \($50/yr\)

~500,000 tokens/day

90%, 100%

Soft warning

Pro / Concierge

Unlimited

None

No restriction

__SECTION 6__

__Alternative AI APIs ΓÇö When to Switch & How__

OpenAI is your foundation\. Here is what to move to as you scale, and exactly how to do it\.

OpenAI GPT\-4o is the right choice to start\. It is well\-documented, highly capable, and the team likely already has experience with it\. As JapaLearn scales, you will hit specific situations where a different provider is the better tool\. This section maps each situation to the best alternative and gives you the exact migration steps\.

## __6\.1  Provider Comparison for JapaLearn Use Cases__

__Provider__

__Best For__

__Key Strength__

__Key Weakness__

__Cost Level__

__Switch Priority__

OpenAI GPT\-4o

Current default ΓÇö all 8 Skills

Proven, fast, great JSON output

Cost scales quickly at volume

Medium

Current

Anthropic Claude Sonnet

Report generation, curriculum, long\-form

Best at long structured output, safer content

Slightly slower than GPT\-4o

Medium

MVP 2

Google Gemini 1\.5 Pro

Content ingestion, RAG indexing pipeline

1M token context window ΓÇö ingest entire gov sites

Less predictable structured output

Medium\-Low

MVP 2

Mistral Large

High\-volume Q&A, cost reduction

50\-70% cheaper than GPT\-4o on high volume

Less capable on complex reasoning

Low

MVP 3

Cohere Command R\+

RAG\-native responses, citation grounding

Built\-in RAG with document citations

Smaller ecosystem, less community support

Low

MVP 3

OpenAI o1 / o3

Complex eligibility decisions, edge cases

Best reasoning for multi\-variable decisions

Much slower, much higher cost

High

Pro Tier

## __6\.2  Recommended Migration Roadmap__

__NOW
Launch__

__OpenAI GPT\-4o for all 8 Skills__

OpenAI text\-embedding\-3\-small for all RAG embeddings\. This is your production foundation ΓÇö stable, capable, well\-supported\.

__MVP 2
10K\+ Users__

__Add Claude Sonnet for Skills 02 & 03 \(Report Generator \+ Curriculum Builder\)__

Claude Sonnet 4 produces significantly better long\-form, structured narrative output\. Migration reports and learning curricula are long, deeply personalised documents ΓÇö Claude handles these better\. GPT\-4o stays for Skills 01, 04, 07 \(scoring and Q&A where speed matters\)\.

__MVP 2
Content__

__Add Gemini 1\.5 Pro for content ingestion pipeline__

Gemini's 1 million token context window lets you feed entire government immigration websites in a single prompt for RAG indexing\. Use it as a background processing job ΓÇö not for user\-facing responses\.

__MVP 3
50K\+ Users__

__Route high\-volume Q&A to Mistral Large for cost savings__

When the chatbot is handling thousands of daily messages, Mistral Large reduces your per\-token cost by 50\-70% vs GPT\-4o with acceptable quality\. Implement A/B testing first to validate quality for your specific use cases before full rollout\.

__Pro Tier
Power Users__

__Add OpenAI o1 for Skill 07 \(Eligibility Checker\) on Pro plan__

Visa eligibility decisions involve multi\-variable reasoning across changing rules\. For Pro/Concierge users where a wrong answer has serious consequences, o1's advanced reasoning is worth the cost\. Regular users stay on GPT\-4o\.

## __6\.3  How to Switch Providers ΓÇö Step\-by\-Step__

### __Switching Skill 02 & 03 to Anthropic Claude__

This is likely your first provider addition\. The AI model constant pattern makes it simple:

// lib/ai\.ts ΓÇö updated to support multiple providers

import OpenAI from 'openai';

import Anthropic from '@anthropic\-ai/sdk';

export const openai = new OpenAI\(\{ apiKey: process\.env\.OPENAI\_API\_KEY \}\);

export const anthropic = new Anthropic\(\{ apiKey: process\.env\.ANTHROPIC\_API\_KEY \}\);

// OpenAI still handles most skills and all embeddings

export const OPENAI\_MODEL = 'gpt\-4o';

export const EMBEDDING\_MODEL = 'text\-embedding\-3\-small';

// Claude handles report and curriculum generation

export const CLAUDE\_MODEL = 'claude\-sonnet\-4\-20250514';

// Skills routing: which model handles which skill

export const SKILL\_PROVIDER: Record<string, 'openai' | 'claude'> = \{

  READINESS\_SCORER:    'openai',

  REPORT\_GENERATOR:    'claude',   // <\-\- switched

  CURRICULUM\_BUILDER:  'claude',   // <\-\- switched

  QA\_ASSISTANT:        'openai',

  DOCUMENT\_REVIEW:     'openai',

  COUNTRY\_COMPARISON:  'openai',

  ELIGIBILITY\_CHECKER: 'openai',

  ONBOARDING:          'openai',

\};

Then update your master route to use the right client:

// app/api/\[route\]/route\.ts ΓÇö updated master pattern

import \{ openai, anthropic, OPENAI\_MODEL, CLAUDE\_MODEL, SKILL\_PROVIDER \} from '@/lib/ai';

// \.\.\. \(RAG and search remain the same\)

const provider = SKILL\_PROVIDER\[skillName\] ?? 'openai';

let answer: string;

if \(provider === 'claude'\) \{

  const res = await anthropic\.messages\.create\(\{

    model: CLAUDE\_MODEL,

    max\_tokens: 2000,

    system: skill,

    messages: \[\{ role: 'user', content: enrichedMessage \}\]

  \}\);

  answer = res\.content\[0\]\.type === 'text' ? res\.content\[0\]\.text : '';

\} else \{

  const res = await openai\.chat\.completions\.create\(\{

    model: OPENAI\_MODEL,

    messages: \[

      \{ role: 'system', content: skill \},

      \{ role: 'user', content: enrichedMessage \}

    \],

    max\_tokens: 1500,

    temperature: 0\.3

  \}\);

  answer = res\.choices\[0\]\.message\.content ?? '';

\}

return Response\.json\(\{ answer \}\);

__The Key Design Principle__

Because your Skills are defined as isolated string constants, and your model selection is a lookup table, switching any skill from one provider to another takes a single line of code in SKILL\_PROVIDER\. You never need to touch API routes, system prompts, or RAG logic\. This is the entire point of the architecture\.

### __Adding Gemini for Content Ingestion__

Gemini is used as a background pipeline, not in user\-facing routes\. Create a separate script:

// scripts/ingestContent\.ts

// Run this as a scheduled job \(weekly/monthly\) not in real\-time user flows

import \{ GoogleGenerativeAI \} from '@google/generative\-ai';

import \{ addDocument \} from '@/lib/rag';

const gemini = new GoogleGenerativeAI\(process\.env\.GOOGLE\_AI\_API\_KEY\!\);

async function ingestGovernmentPage\(url: string, country: string\) \{

  const pageContent = await fetch\(url\)\.then\(r => r\.text\(\)\);

  const model = gemini\.getGenerativeModel\(\{ model: 'gemini\-1\.5\-pro' \}\);

  const result = await model\.generateContent\(

    \`Extract and structure all migration\-relevant information from this page\.

     Focus on: eligibility requirements, fees, timelines, document checklists\.

     Output as plain structured text\.\\n\\nPage content:\\n$\{pageContent\}\`

  \);

  const structured = result\.response\.text\(\);

  await addDocument\(structured, \{ country, source\_url: url, category: 'visa' \}\);

  console\.log\(\`Ingested: $\{url\}\`\);

\}

__SECTION 7__

__Environment Variables & API Keys__

Every credential you need, where to get it, and what it powers

## __7\.1  Complete Environment Variables Checklist__

__Variable Name__

__Where to Get It__

__What It Powers__

__Required At__

OPENAI\_API\_KEY

platform\.openai\.com ΓåÆ API Keys

All AI responses \(launch\), embeddings \(ongoing\)

Launch

ANTHROPIC\_API\_KEY

console\.anthropic\.com ΓåÆ API Keys

Claude ΓÇö Report Generator, Curriculum Builder

MVP 2

GOOGLE\_SEARCH\_API\_KEY

console\.developers\.google\.com

Real\-time migration search \(Custom Search API\)

Launch

GOOGLE\_SEARCH\_CX

programmablesearchengine\.google\.com

Your JapaLearn Migration search engine ID

Launch

GOOGLE\_AI\_API\_KEY

aistudio\.google\.com ΓåÆ Get API Key

Gemini ΓÇö content ingestion pipeline

MVP 2

NEXT\_PUBLIC\_SUPABASE\_URL

Supabase ΓåÆ Project Settings ΓåÆ API

Supabase database connection \(public\)

Launch

SUPABASE\_SERVICE\_ROLE\_KEY

Supabase ΓåÆ Project Settings ΓåÆ API

Supabase admin access ΓÇö RAG read/write

Launch

WHATSAPP\_BUSINESS\_TOKEN

business\.whatsapp\.com ΓåÆ Cloud API

Cohort group creation \(MVP 2\)

MVP 2

## __7\.2  \.env\.local Template__

\# ΓöÇΓöÇΓöÇ AI PROVIDERS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

OPENAI\_API\_KEY=sk\-\.\.\.

ANTHROPIC\_API\_KEY=sk\-ant\-\.\.\.          \# Add at MVP 2

GOOGLE\_AI\_API\_KEY=AIza\.\.\.             \# Add at MVP 2 for Gemini ingestion

\# ΓöÇΓöÇΓöÇ REAL\-TIME SEARCH ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

GOOGLE\_SEARCH\_API\_KEY=AIza\.\.\.

GOOGLE\_SEARCH\_CX=0123456789abcdef0

\# ΓöÇΓöÇΓöÇ SUPABASE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

NEXT\_PUBLIC\_SUPABASE\_URL=https://your\-project\.supabase\.co

SUPABASE\_SERVICE\_ROLE\_KEY=eyJ\.\.\.

\# ΓöÇΓöÇΓöÇ WHATSAPP \(MVP 2\) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

WHATSAPP\_BUSINESS\_TOKEN=EAAa\.\.\.       \# Add at MVP 2 for cohort groups

## __7\.3  API Cost Estimates__

Use these estimates to budget your AI infrastructure costs at each growth stage:

__Provider / Service__

__Model__

__Input Cost__

__Output Cost__

__JapaLearn Estimate__

OpenAI ΓÇö Responses

gpt\-4o

$2\.50/1M tokens

$10\.00/1M tokens

~$80/month at 5K users

OpenAI ΓÇö Embeddings

text\-embedding\-3\-small

$0\.02/1M tokens

N/A

~$2/month ongoing

Anthropic Claude

claude\-sonnet\-4

$3\.00/1M tokens

$15\.00/1M tokens

~$30/month at MVP 2

Google Search API

Custom Search

$5 per 1,000 queries

ΓÇö

~$10/month at 5K users

Google Gemini

gemini\-1\.5\-pro

$3\.50/1M tokens

$10\.50/1M tokens

~$5/month \(batch only\)

Supabase

pgvector \+ DB

Free tier / $25/month Pro

ΓÇö

$0 launch / $25 at scale

__SECTION 8__

__Claude Code Implementation Prompt__

Paste this directly into Claude Code to start building

__How to Use This Prompt__

Copy the prompt below and paste it directly into Claude Code\. Claude Code will read the context and implement each section in order\. It will ask before making decisions not covered in this document\.

I have a working JapaLearn AI application built with Next\.js 14 and Supabase\.

I am currently using OpenAI for AI responses and embeddings\.

Please implement the following in this exact order, following the

JapaLearn AI Master Architecture Document v2\.0:

1\. Confirm lib/ai\.ts exists with OpenAI client \+ model constants\.

   Create it if missing using the pattern in Section 1\.

2\. Create lib/embeddings\.ts with getEmbedding\(\) using text\-embedding\-3\-small\.

3\. Run the Supabase SQL from Section 2\.1 to enable pgvector and create

   the migration\_documents table and match\_documents function\.

4\. Create lib/rag\.ts with retrieveContext\(\) and addDocument\(\) from Section 2\.3\.

5\. Create lib/googleSearch\.ts with searchMigrationInfo\(\) from Section 3\.3\.

6\. Create lib/skills\.ts with all 8 Skill constants from Section 4,

   exported as the SKILLS object\.

7\. Update all existing AI API routes to use the master pattern from Section 5\.1:

   RAG retrieval \+ Google Search \+ correct Skill \+ OpenAI call\.

8\. Add the AI usage tracking table from Section 5\.3\.

Before making any change, show me what you plan to do\.

Do not skip steps\. Ask me if you need any file paths or existing code to reference\.

Use TypeScript throughout\. Do not use any deprecated APIs\.

__SECTION 9__

__Skills\-to\-Product Feature Map__

Which Skill fires on which platform screen or action ΓÇö at a glance

Use this reference to know which Skill to pass as the system prompt for any user action in the product\.

__Platform Screen / Action__

__Skill__

__RAG__

__Search__

__Phase__

First\-time landing ΓÇö no quiz taken

ONBOARDING

No

No

Launch

Quiz submitted ΓÇö calculate score

READINESS\_SCORER

No

No

Launch

Migration Report page generated

REPORT\_GENERATOR

Yes

Yes

Launch

Dashboard ΓÇö Learning path generated

CURRICULUM\_BUILDER

Yes

No

Launch

Quiz retaken ΓÇö update report

READINESS\_SCORER \+ REPORT\_GENERATOR

Yes

Yes

Launch

Chatbot ΓÇö user sends message

QA\_ASSISTANT

Yes

Yes

MVP 2

Document uploaded for review

DOCUMENT\_REVIEW

Yes

Yes

MVP 2

User compares two countries

COUNTRY\_COMPARISON

Yes

Yes

MVP 2

Specific visa eligibility check

ELIGIBILITY\_CHECKER

Yes

Yes

MVP 2

Marketplace agent matching \(future\)

COUNTRY\_COMPARISON

Yes

No

MVP 3

JapaLearn AI ΓÇö Master Architecture Document v2\.0  ┬╖  April 2026  ┬╖  Confidential

Tomide Williams  |  Internal Product & Engineering Use Only

Every Nigerian deserves a clear path forward\. Build it\.

