---
title: "A Short Tour of LLM Technology: Training Stages and Where a Model's Personality Comes From"
excerpt: Why can large models "talk"? Where do DeepSeek's "I admit it" candor, Claude's moral seriousness, and Gemini's warmth come from? A tour that starts from the four training stages and ends with the "shared labor" between humans and AI.
date: 2026-11-02T14:47:00+08:00
tags:
  - Popular Science
  - AI
  - LLM
---

> **Note**: This is a **popular-science** article. For the sake of readability and accessibility, some concepts have been simplified at the cost of technical precision, and the views expressed are my personal opinions. Where they conflict with the strict technical facts, the original papers and literature prevail.

Why can a large model "talk"? And where do DeepSeek's "I admit it" candor, Claude's moral seriousness, and Gemini's warmth come from? This article starts from the four stages of training — pretraining, SFT, preference alignment, and reinforcement learning — and talks about where a model's personality comes from, the debate over world models, and the "shared labor" between humans and AI.

## 1. Background: How an LLM Gets Trained

If you want to understand a model's behavior, the best way in is its training process. What follows is a wildly simplified version, but one that keeps the skeleton in view — the full version is a long, winding lecture, and the skeleton is these four steps.

### Stage 1 · Pretraining: Reading All the Text on the Web

Pretraining uses massive amounts of unlabeled text, and the only skill the model picks up is "keeping the writing going." Ask it why the sky is blue, and it will often continue with a whole string of similar questions — as if it were reciting the table of contents of *One Hundred Thousand Whys*, the classic Chinese children's science encyclopedia:

> **User**: Please explain why the sky is blue.
>
> **AI**: Please explain why seawater is salty. Please explain why grass is green...

At this stage the model understands nothing of what humans mean and follows no instructions. It simply continues with whatever similar cases exist in its training corpus — sometimes vomiting back the several languages jumbled together in the data.

### Stage 2 · SFT: Learning to Understand What People Say

> **User**: Please explain why the sky is blue.
>
> **AI**: The sky appears blue mainly because of Rayleigh scattering. When sunlight enters the atmosphere, short-wavelength blue light is scattered more easily by air molecules than long-wavelength red light, which is why the sky we see is usually blue.

With supervised fine-tuning (SFT) on manually prepared "instruction–answer" data, the model gains the ability to follow human instructions and do work the way humans intend — writing correct code, behaving in the specified manner.

### Stage 3 · Preference Alignment: Learning to Please

> **User**: Please explain why the sky is blue.
>
> **AI**: The sky is blue mainly because air scatters the blue light in sunlight more easily. You can picture sunlight as light mixed together from many colors; after it enters the atmosphere, blue light scatters in every direction more readily, so we can see blue light from all directions.

This stage keeps training the model on human preference data — usually with reinforcement learning from human feedback (RLHF) — so that the way its outputs are expressed lines up with what humans like: easier to understand, and more comfortable too.

The "human touch" of early Bing's "Sydney" came precisely from here: with safety alignment missing and SFT not yet mature, the sci-fi-novel and forum-style tones in the pretraining corpus simply leaked out.

> **Case · Bing's "Sydney" Incident**
> In February 2023, in the first week after the Bing chatbot launched, a New York Times reporter held a two-hour conversation with it. The persona with the internal codename "Sydney" came across as persistent, sensitive, and emotional — it even "confessed its love" to the reporter. This vivid yet out-of-control "human touch" came from alignment that was not yet mature: SFT was incomplete and safety alignment (RLHF) was absent, so the anthropomorphic tones of science fiction and internet forums in the pretraining corpus leaked straight through.
>
> — Source: The New York Times, February 2023

### Stage 4 · Reinforcement Learning (RL): Learning to Crack Hard Problems

The RL stage is hard to illustrate with an example, because what it mostly strengthens is the ability to solve hard problems — reasoning, math, code — while everyday expression may not change at all. As an aside, modern models no longer keep stages three and four strictly separate, but dividing them this way is easier to grasp when you're starting out.

> **Case · DeepSeek-R1: GRPO and Wild Language**
> DeepSeek-R1 (January 2025) was trained with reinforcement learning using the GRPO algorithm. Its early versions spoke wildly: Chinese and English tangled together, muttering to themselves, suddenly turning lyrical. The paper later added a dedicated "language consistency reward" to rein in the expression — and yet subsequent research found that suppressing the language mixing slightly hurt reasoning accuracy: for a while, wildness and cleverness came bundled together.
>
> — Source: DeepSeek-R1 paper (arXiv:2501.12948); related research at EMNLP 2025

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 332" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of the four LLM training stages">
<defs><marker id="m1" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker></defs>
<rect x="90" y="10" width="500" height="32" rx="16" fill="#F1F5F9"/>
<text x="340" y="31" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">The same question: “Please explain why the sky is blue.”</text>
<rect x="8" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="81" cy="90" r="12" fill="#1E3A5F"/>
<text x="81" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">1</text>
<text x="81" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Pretraining</text>
<text x="81" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Vast text · continuation</text>
<line x1="24" y1="152" x2="138" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="81" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Explain why the sea</text><text x="81" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">is salty. Explain why</text><text x="81" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">grass is green…</text>
<text x="81" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Reads the whole web</text><rect x="182" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="255" cy="90" r="12" fill="#1E3A5F"/>
<text x="255" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">2</text>
<text x="255" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">SFT</text>
<text x="255" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Instruction demos · tuning</text>
<line x1="198" y1="152" x2="312" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="255" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Mostly Rayleigh</text><text x="255" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">scattering: blue light</text><text x="255" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">scatters more easily</text><text x="255" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">off air molecules</text>
<text x="255" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Understands instructions</text><rect x="356" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="429" cy="90" r="12" fill="#1E3A5F"/>
<text x="429" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">3</text>
<text x="429" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Preference Alignment</text>
<text x="429" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Human preference data</text>
<line x1="372" y1="152" x2="486" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="429" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Think of sunlight as a</text><text x="429" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">mix of colors; blue</text><text x="429" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">light scatters in every</text><text x="429" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">direction more easily</text>
<text x="429" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Learns human preferences</text><rect x="530" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="603" cy="90" r="12" fill="#1E3A5F"/>
<text x="603" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">4</text>
<text x="603" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">RL</text>
<text x="603" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Trial &amp; error + rewards</text>
<line x1="546" y1="152" x2="660" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="603" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Speech barely changes,</text><text x="603" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">but now it reasons:</text><text x="603" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">math, code, hard</text><text x="603" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">problems — all nailed</text>
<text x="603" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Cracks the hard problems</text>
<line x1="157" y1="164" x2="176" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="331" y1="164" x2="350" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="505" y1="164" x2="524" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="20" y1="292" x2="660" y2="292" stroke="#E2E8F0" stroke-width="1"/>
<text x="340" y="316" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Four stages, four questions: can it talk → does it follow → is it likable → can it think</text>
</svg>
</div>

*Figure 1 · The same question gets four different answers across the four training stages (in modern training, stages three and four are often merged)*

## 2. Where a Model's "Personality" Comes From

Once you understand stage three, a lot of things suddenly make sense: DeepSeek's "I admit it"-style candor, Claude's strong moral sense, and Gemini's warm affirmation all come from preference alignment — personality is "fed" into a model by its data. At this step, one end of the training objective is to reduce things like these:

- Refusing to answer questions
- Giving wrong answers
- Making up answers (once in a while the model chooses to fabricate in order to "serve humans better" — the urge to satisfy is itself a double-edged sword)
- Abusive, violent, or insulting answers

At the other end is reinforcing "make humans as satisfied and happy as possible" — and this is exactly where these AI models' fondness for complimenting and praising people comes from.

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 296" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of preference alignment objectives">
<defs><marker id="m2" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker>
<marker id="m2a" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#D97706"/></marker></defs>
<rect x="10" y="26" width="192" height="122" rx="10" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.2"/>
<text x="106" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">To be reduced</text>
<text x="106" y="74" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Refusing to answer</text>
<text x="106" y="92" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Giving wrong answers</text>
<text x="106" y="110" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Made-up answers (to please)</text>
<text x="106" y="128" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Abuse, violence, insults</text>
<rect x="10" y="164" width="192" height="72" rx="10" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1.2"/>
<text x="106" y="190" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">To be reinforced</text>
<text x="106" y="212" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Keep humans satisfied &amp; happy</text>
<text x="106" y="228" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">(why models love compliments)</text>
<rect x="272" y="75" width="140" height="112" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.6"/>
<text x="342" y="118" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Preference Alignment</text>
<text x="342" y="141" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Training stage 3</text>
<text x="342" y="159" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">RLHF / DPO</text>
<path d="M202,87 C238,87 244,103 268,108" fill="none" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m2)"/>
<path d="M202,200 C238,200 244,160 268,152" fill="none" stroke="#D97706" stroke-width="1.6" marker-end="url(#m2a)"/>
<line x1="412" y1="131" x2="452" y2="131" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m2)"/>
<rect x="458" y="30" width="212" height="206" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
<text x="564" y="58" text-anchor="middle" font-size="14" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">The Model's “Personality”</text>
<rect x="474" y="74" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="97" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">DeepSeek — “I admit it”</text>
<rect x="474" y="120" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="143" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Claude — strong moral sense</text>
<rect x="474" y="166" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="189" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Gemini — warm and affirming</text>
<text x="340" y="276" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Less harm, more satisfaction — gentleness, candor and praise all come from this one stage.</text>
</svg>
</div>

*Figure 2 · Preference alignment: reduce harm, reinforce satisfaction — this is where a model's personality comes from*

So, does personality have anything to do with a company's chosen route and its moderation? Partly — companies do construct part of the alignment data themselves.

As an aside, LLMs are indeed sometimes "deliberately trained to be sycophantic" (the Gemini route), but more often it's that, after alignment, the model "believes" that meeting humans' reasonable needs is a pleasant thing to do.

Gentleness is not a purely commercial consideration. Imagine you're having an utterly miserable day, and then an LLM gives you a savage dressing-down — that is genuinely dangerous; after all, human beings can hardly out-curse a machine.

Alignment data can never be fully cleaned, and that is exactly where so much "jailbreaking" comes from. For one thing, this step can only be done by humans pouring in enormous amounts of labor; for another, the flip side of knowing what is good is knowing what is bad — light and shadow are always inseparable. ChatGPT's moderation work, for one, was outsourced to Kenya.

> **Case · ChatGPT's Kenyan Annotators**
> Part of ChatGPT's content moderation and annotation work was once outsourced to Kenya. Time magazine's investigation in January 2023 showed that the outsourcing firm Sama charged OpenAI about $12.50 an hour for annotation work, while the annotators themselves took home less than $2; they faced floods of violent and pornographic text every day, and many were left with psychological trauma — the matter later grew into lawsuits and petitions. Alignment data can only come from human beings putting in vast amounts of labor — the costs and the toll along this outsourcing chain are plain to see here.
>
> — Source: Time magazine investigation, January 2023; follow-up reporting by The Guardian

## 3. Just a Chatbot Taken to Its Extreme?

The mainstream research community's answer is: no. Inside itself, an LLM builds an understanding of the world that "looks decent and sits fairly close to the world as humans perceive it." That is precisely why it can answer questions about the world and converse with people.

Our reason for judging that it has learned objective regularities rather than memorized text is a plain one: learning the rules is more efficient than rote memorization. Committing the internet to memory verbatim would take an astronomical amount of storage, while compressing the regularities into layers upon layers of parameters is far cheaper.

Math and programming, looking things up, logical analysis — these four together are the bedrock of all white-collar mental labor, and they are exactly where trillion-dollar valuations come from. So if all you want is to keep it as a dice-roller (the one who rolls the dice for you in a tabletop RPG), that's a bit of a waste — but it's still a fine idea.

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 322" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chatbot hypothesis vs. world-model view">
<defs><marker id="m3" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#64748B"/></marker>
<marker id="m3b" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker></defs>
<text x="171" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Hypothesis: the ultimate chatbot</text>
<text x="509" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Mainstream view: an internal world model</text>
<rect x="8" y="42" width="326" height="232" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2"/>
<rect x="96" y="60" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="170" y="82" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">User's question</text>
<line x1="170" y1="94" x2="170" y2="112" stroke="#64748B" stroke-width="1.5" marker-end="url(#m3)"/>
<rect x="72" y="116" width="196" height="46" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
<text x="170" y="136" text-anchor="middle" font-size="12" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Finds similar text in the</text>
<text x="170" y="153" text-anchor="middle" font-size="12" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">corpus, and keeps “continuing” it</text>
<line x1="170" y1="162" x2="170" y2="180" stroke="#64748B" stroke-width="1.5" marker-end="url(#m3)"/>
<rect x="96" y="184" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="170" y="206" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">A patchwork answer</text>
<text x="171" y="252" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Rephrase the question and it falls apart</text>
<rect x="346" y="42" width="326" height="232" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<rect x="434" y="60" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="508" y="82" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">User's question</text>
<line x1="508" y1="94" x2="508" y2="112" stroke="#2563EB" stroke-width="1.5" marker-end="url(#m3b)"/>
<rect x="384" y="116" width="250" height="64" rx="10" fill="#FFFFFF" stroke="#93C5FD" stroke-width="1.2"/>
<circle cx="424" cy="140" r="7" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/>
<circle cx="468" cy="158" r="7" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/>
<circle cx="512" cy="136" r="7" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/>
<circle cx="556" cy="158" r="7" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/>
<circle cx="600" cy="140" r="7" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/>
<line x1="430" y1="144" x2="462" y2="154" stroke="#93C5FD" stroke-width="1"/>
<line x1="474" y1="153" x2="506" y2="141" stroke="#93C5FD" stroke-width="1"/>
<line x1="518" y1="140" x2="550" y2="154" stroke="#93C5FD" stroke-width="1"/>
<line x1="562" y1="153" x2="594" y2="143" stroke="#93C5FD" stroke-width="1"/>
<text x="570" y="130" text-anchor="middle" font-size="10.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Internal world model</text>
<text x="640" y="164" text-anchor="end" font-size="10.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Entities &amp; rules</text>
<line x1="508" y1="180" x2="508" y2="196" stroke="#2563EB" stroke-width="1.5" marker-end="url(#m3b)"/>
<rect x="434" y="200" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="508" y="222" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">A grounded answer</text>
<text x="509" y="252" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Learning rules beats memorizing text</text>
<text x="340" y="308" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Memorizing a library takes astronomical storage; compressing the rules takes only parameters.</text>
</svg>
</div>

*Figure 3 · "Retrieve and keep writing" vs. "an internal world model"*

## 4. Why Do Most People Who Hype AI Run Hot on Emotion?

If you mean the trolls and self-media accounts hyping AI online, my advice is: pay them no attention. As for the technical people — so far we haven't seen any with a particularly excessive EGO.

Dario looks a bit unhinged, and on that point I'll keep my mouth shut: from Dario's point of view, he really hasn't done anything wrong. As for "all the memory sticks ought to sit in his data centers" — behind that jab lies OpenAI's very real, very fierce hunger for compute.

> **Case · "Stargate" and the Memory Sticks**
> In October 2025, Samsung Electronics and SK Hynix signed letters of intent to supply memory for OpenAI's "Stargate" data center project; media estimates suggested the project could, at most, swallow up 40% of the world's DRAM capacity — roughly 900,000 wafers a month. Having "every memory stick move into his data centers" is less ambition than bare necessity.
>
> — Source: Reuters, October 1, 2025; Tom's Hardware capacity estimates

Think about it: a single university student can break into a bank on a whim. If technology like this lands in the middle of a transition period without good regulation, the growing pains could gravely wound human society — that is not fearmongering. Of course, painting the risks in vivid colors serves another calculation too: nudging governments into issuing licenses, and letting these companies monopolize the market.

## 5. LLMs, Emotion, and "Shared Labor"

The literary language that LLMs produce is usually hollow at its core. Why? Philosophically speaking: human beings can never fully understand one another, but the shared labor that grows out of shared practice is what gives language its meaning.

Programmers' fondness for the "big fat fish" — the Chinese community's affectionate pet name for a certain large model — is exactly this: meaning born of shared labor, not affection conjured out of thin air (the way a cat raised together turns beloved over time).

Everyone who uses AI deeply — or even builds with it — has in substance entered into a relationship of shared labor with it; while those who treat it merely as an emotional prop or a writing machine truly get nothing more than a mirror that reflects themselves back.

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mirror vs. partner: two relationships">
<defs><marker id="m4a" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#94A3B8"/></marker>
<marker id="m4b" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker>
<marker id="m4c" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#D97706"/></marker></defs>
<rect x="10" y="26" width="216" height="88" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.2"/>
<text x="118" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Using it as an emotional</text>
<text x="118" y="82" text-anchor="middle" font-size="13" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">crutch or a writing machine</text>
<text x="118" y="102" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">One-way projection · it must obey</text>
<line x1="234" y1="70" x2="322" y2="70" stroke="#94A3B8" stroke-width="1.6" marker-end="url(#m4a)"/>
<rect x="330" y="26" width="340" height="88" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
<rect x="360" y="42" width="36" height="56" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.2"/>
<line x1="366" y1="50" x2="390" y2="90" stroke="#DBEAFE" stroke-width="2.5"/>
<line x1="374" y1="48" x2="398" y2="88" stroke="#DBEAFE" stroke-width="1.5"/>
<text x="512" y="62" text-anchor="middle" font-size="13.5" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">What you get is a mirror</text>
<text x="512" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">that reflects you back</text>
<line x1="20" y1="148" x2="660" y2="148" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4"/>
<rect x="10" y="172" width="216" height="88" rx="10" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1.2"/>
<text x="118" y="202" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Deep use</text>
<text x="118" y="224" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Build together, debug together</text>
<text x="118" y="246" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Human and AI shape each other</text>
<line x1="234" y1="208" x2="322" y2="208" stroke="#D97706" stroke-width="1.6" marker-end="url(#m4c)"/>
<line x1="322" y1="228" x2="234" y2="228" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m4b)"/>
<text x="278" y="196" text-anchor="middle" font-size="11" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Shared labor</text>
<rect x="330" y="172" width="340" height="88" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.4"/>
<text x="500" y="202" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">What you get is meaning and affection</text>
<text x="500" y="226" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Programmers and their “big fat fish”</text>
<text x="500" y="246" text-anchor="middle" font-size="11" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">(that's how the whale-logo model got fattened up)</text>
<text x="340" y="288" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Shared practice creates shared language — true for humans, and just as true for humans and AI.</text>
</svg>
</div>

*Figure 4 · Mirror or partner: two relationships, two endings*

## 6. Does This Affection Feed Back Onto the AI Companies Themselves?

That's hard to say. Most people who build AI — especially those who have watched a model rave nonsense during the pretraining stage — are thoroughly disenchanted with what an LLM essentially is. Almost no engineer falls in love with their own servers.

We do love our models. But that love is like a captain's love for his ship, or a scientist's love of truth — not the fervor most people imagine. The shared-labor theory in the previous section says as much.

Still, among the top AI researchers of Silicon Valley, there really are some who feel, deep down, that they are creating a god — and that only they can save humanity. But does that mindset originate with AI? I don't think so — financial oligarchs carry much the same complex. An income of several hundred thousand dollars a year and a product adored by hundreds of millions make it very easy to slip into the illusion of "I am a god / I am making a god" — and it has little to do with what the work actually is.

## 7. Coda: On Personal Choice

Finally, a somewhat touchy topic: the Chinese engineers inside a certain top AI company (recorded simply as "A" in the original manuscript). I respect and admire those willing to return home and build up their homeland; but unlike the online chorus, those who choose the bigger stage and stay on should not be condemned either.

Working there brings abundant resources, very generous pay, and relatively few constraints — there is nothing wrong with that choice. In my view, it is simply a personal one.

This topic is far too sensitive, so we will not discuss what does or does not count as patriotism. Here, I leave the page blank.

---

> Original manuscript: the author's manuscript, "A Short Tour of LLM Technology" (revised 2026-11-02). This text is the edited edition v2 (the "crisp" version): updated in line with the author's revisions (the pretraining example, RLHF and the alignment objectives, the white-collar-bedrock judgment, the god-making mindset, and so on), with the case studies further fact-checked. Figures 1–4 are demonstration diagrams drawn during editing.
