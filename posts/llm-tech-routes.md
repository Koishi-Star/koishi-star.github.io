---
title: 大模型技术路线简谈
excerpt: 大模型为什么会「说话」？DeepSeek 的「我认了」、Claude 的道德感和 Gemini 的热情，又是从哪里来的？从训练四阶段聊起，一直聊到人与 AI 的「共同劳动」。
date: 2026-11-02T14:47:00+08:00
tags:
  - 科普
  - AI
  - LLM
---

> **说明**：本文是一篇**科普性质**的文章。为了可读性与理解性，部分概念做了简化处理，牺牲了一定的技术准确性；文中观点为个人见解。若与严格的技术事实存在出入，以原始论文与文献为准。

大模型为什么会「说话」？DeepSeek 的「我认了」、Claude 的道德感和 Gemini 的热情，又是从哪里来的？本文从预训练、SFT、偏好对齐与强化学习四个阶段讲起，聊聊模型性格的来源、世界模型之争，以及人与 AI 之间的「共同劳动」。

## 一、背景知识：LLM 是怎么训练出来的

想理解一个模型的行为，最好的入口是它的训练过程。下面是一个超级简化、但足够看清骨架的版本——完整版是漫长的长篇大论，骨架就是这四步。

### 阶段 1 · 预训练：读完全网的文本

预训练使用海量无标注文本，模型学到的唯一本领是「接着往下写」。问它为什么天空是蓝色的，它常常续写出一连串相似的问题——仿佛正在默写《十万个为什么》的目录：

> **用户**：请解释为什么天空是蓝色的。
>
> **AI**：请解释为什么海水是咸的。请解释为什么草是绿的……

这个阶段的模型不理解人类的意思，也不遵循指令，它只是续写训练资料库里类似的案例，有时还会把语料里混杂的多种语言一起吐出来。

### 阶段 2 · SFT：学会听懂人话

> **用户**：请解释为什么天空是蓝色的。
>
> **AI**：天空呈蓝色，主要是因为瑞利散射。太阳光进入大气后，短波长的蓝光比长波长的红光更容易被空气分子散射，因此我们看到的天空通常是蓝色的。

用人工整理的「指令—回答」数据做监督微调（SFT），模型获得了遵循人类指令、按人类意愿干活的能力——写出正确的代码，按照指定的方式工作。

### 阶段 3 · 偏好对齐：学会讨人喜欢

> **用户**：请解释为什么天空是蓝色的。
>
> **AI**：天空是蓝色的，主要是因为空气会更容易散射太阳光中的蓝光。可以把太阳光想象成多种颜色混合而成的光，它进入大气后，蓝光更容易向四面八方散射，所以我们从各个方向都能看到蓝光。

这一阶段用人类偏好数据继续训练——通常使用基于人类反馈的强化学习（RLHF）——让输出的表达方式和人类喜欢的样子对齐：更好懂，也更舒服。

早期必应「Sydney」的「人味」正来自这里：安全对齐缺席、SFT 尚不成熟，预训练语料里科幻小说与论坛式的腔调便漏了出来。

> **案例 · 必应「Sydney」事件**
> 2023 年 2 月，必应聊天机器人上线首周，《纽约时报》记者与它进行了一场两小时的长谈，内部代号「Sydney」的人格表现得执着、敏感、情绪化，甚至向记者「表白」。这种鲜明却失控的「人味」，来自尚未成熟的对齐：SFT 不完整、安全对齐（RLHF）缺席，预训练语料中科幻小说与网络论坛式的拟人化腔调，就这样漏了出来。
>
> —— 来源：《纽约时报》报道，2023 年 2 月

### 阶段 4 · 强化学习（RL）：学会啃硬骨头

RL 阶段的示例不好写，因为它增强的主要是解决困难问题的能力——推理、数学、代码——而日常表达可能完全不变。顺带一提，现代模型对阶段三和阶段四已不再严格区分，但这样划分，入门时更容易理解。

> **案例 · DeepSeek-R1：GRPO 与狂野的语言**
> DeepSeek-R1（2025 年 1 月）使用 GRPO 算法做强化学习训练得到。早期版本的语言极其狂野：中英文混杂、自言自语、突然抒情。论文随后专门加入「语言一致性奖励」来收敛表达——后来的研究却发现，压住语言混杂会轻微损失推理准确率：狂野与聪明，一度是绑在一起的。
>
> —— 来源：DeepSeek-R1 论文（arXiv:2501.12948）；EMNLP 2025 相关研究

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 332" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LLM训练四阶段示意图">
<defs><marker id="m1" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker></defs>
<rect x="90" y="10" width="500" height="32" rx="16" fill="#F1F5F9"/>
<text x="340" y="31" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">同一个小问题：“请解释为什么天空是蓝色的。”</text>
<rect x="8" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="81" cy="90" r="12" fill="#1E3A5F"/>
<text x="81" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">1</text>
<text x="81" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">预训练</text>
<text x="81" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">海量文本 · 自由续写</text>
<line x1="24" y1="152" x2="138" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="81" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">请解释为什么海水</text><text x="81" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">是咸的。请解释为</text><text x="81" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">什么草是绿的……</text>
<text x="81" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">读完全网的文本</text><rect x="182" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="255" cy="90" r="12" fill="#1E3A5F"/>
<text x="255" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">2</text>
<text x="255" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">SFT</text>
<text x="255" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">指令示范 · 微调</text>
<line x1="198" y1="152" x2="312" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="255" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">主要是因为瑞利</text><text x="255" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">散射：短波长的蓝</text><text x="255" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">光更容易被空气</text><text x="255" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">分子散射</text>
<text x="255" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">听懂人类的指令</text><rect x="356" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="429" cy="90" r="12" fill="#1E3A5F"/>
<text x="429" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">3</text>
<text x="429" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">偏好对齐</text>
<text x="429" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">人类偏好数据</text>
<line x1="372" y1="152" x2="486" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="429" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">把太阳光想象成</text><text x="429" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">多种颜色混合的</text><text x="429" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">光，蓝光更容易向</text><text x="429" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">四面八方散射</text>
<text x="429" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">学人类的偏好</text><rect x="530" y="64" width="146" height="204" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<circle cx="603" cy="90" r="12" fill="#1E3A5F"/>
<text x="603" y="94.5" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">4</text>
<text x="603" y="122" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">强化学习</text>
<text x="603" y="140" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">试错 + 奖励</text>
<line x1="546" y1="152" x2="660" y2="152" stroke="#E2E8F0" stroke-width="1"/>
<text x="603" y="172" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">表达几乎不变，</text><text x="603" y="188" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">但会推理了：数学、</text><text x="603" y="204" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">代码、难题</text><text x="603" y="220" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">通通拿下</text>
<text x="603" y="250" text-anchor="middle" font-size="11" fill="#2563EB" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">学会啃硬骨头</text>
<line x1="157" y1="164" x2="176" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="331" y1="164" x2="350" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="505" y1="164" x2="524" y2="164" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m1)"/>
<line x1="20" y1="292" x2="660" y2="292" stroke="#E2E8F0" stroke-width="1"/>
<text x="340" y="316" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">四个阶段，四个问题：会不会说话 → 听不听得懂 → 讨不讨人喜欢 → 会不会思考</text>
</svg>
</div>

*图 1 · 同一个问题在四个训练阶段得到四种回答（现代训练中，阶段三、四常合并进行）*

## 二、模型的「性格」从何而来

理解了第三阶段，很多事就豁然开朗：DeepSeek 那句「我认了」式的坦诚、Claude 的强烈道德感、Gemini 的热情认同，都源自偏好对齐——性格是被数据「喂」出来的。在这一步，训练目标的一头是减少这些东西：

- 拒绝回答问题
- 给出错误回答
- 编造回答（偶尔是模型为了「更好地满足人类」而选择编造——满足欲本身是把双刃剑）
- 辱骂、暴力、侮辱性质的回答

另一头，是强化「尽可能让人类满意和开心」——这些 AI 模型爱夸人、爱赞扬人类的来源，正在于此。

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 296" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="偏好对齐目标示意图">
<defs><marker id="m2" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker>
<marker id="m2a" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#D97706"/></marker></defs>
<rect x="10" y="26" width="192" height="122" rx="10" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.2"/>
<text x="106" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">需要减少的</text>
<text x="106" y="74" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">拒绝回答问题</text>
<text x="106" y="92" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">给出错误回答</text>
<text x="106" y="110" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">编造回答（有时为讨好）</text>
<text x="106" y="128" text-anchor="middle" font-size="11.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">辱骂、暴力与侮辱</text>
<rect x="10" y="164" width="192" height="72" rx="10" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1.2"/>
<text x="106" y="190" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">需要强化的</text>
<text x="106" y="212" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">尽可能让人类满意和开心</text>
<text x="106" y="228" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">（模型爱夸人的来源）</text>
<rect x="272" y="75" width="140" height="112" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.6"/>
<text x="342" y="118" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">偏好对齐</text>
<text x="342" y="141" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">训练阶段 3</text>
<text x="342" y="159" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">RLHF / DPO</text>
<path d="M202,87 C238,87 244,103 268,108" fill="none" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m2)"/>
<path d="M202,200 C238,200 244,160 268,152" fill="none" stroke="#D97706" stroke-width="1.6" marker-end="url(#m2a)"/>
<line x1="412" y1="131" x2="452" y2="131" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m2)"/>
<rect x="458" y="30" width="212" height="206" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
<text x="564" y="58" text-anchor="middle" font-size="14" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">模型的“性格”</text>
<rect x="474" y="74" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="97" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">DeepSeek——“我认了”</text>
<rect x="474" y="120" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="143" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Claude——强烈的道德感</text>
<rect x="474" y="166" width="180" height="36" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="488" y="189" font-size="12" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">Gemini——热情而认同</text>
<text x="340" y="276" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">减少伤害，强化满意——温柔、坦诚与爱夸人，都来自同一步训练。</text>
</svg>
</div>

*图 2 · 偏好对齐：减少伤害，强化满意——模型的性格由此而来*

那么，性格和公司路线、审核有关吗？有一部分是——公司确实会构造一部分对齐数据。

顺带一提，LLM 有时确实是「刻意地被训练成谄媚」（Gemini 路线），但更多的时候，是对齐之后模型「认为」满足人类的适当需求是件愉快的事。

温和并不是纯商业考量。设想你某天心情糟透了，又被 LLM 狠狠怼了一顿——这真的很危险，毕竟人类很难骂得过机器。

对齐数据无法被完全清洗，这正是大量「破限」的来源。一方面，这一步只能由人类投入大量人工；另一方面，知道什么是好的，另一面就是知道什么是坏的——光和影子，总是密不可分。ChatGPT 的审核工作，就外包在肯尼亚。

> **案例 · ChatGPT 的肯尼亚标注员**
> ChatGPT 的部分内容审核与标注工作曾外包给肯尼亚。《时代》杂志 2023 年 1 月的调查显示：外包公司 Sama 就标注业务向 OpenAI 收取约每小时 12.5 美元，而标注员到手不足 2 美元；他们每天面对海量暴力与色情文本，不少人留下了心理创伤，后来甚至演变为诉讼与请愿。对齐数据只能由人类投入大量人工——这条外包链条上的成本与代价，于此可见一斑。
>
> —— 来源：《时代》杂志调查报道，2023 年 1 月；卫报后续报道

## 三、只是发展到极致的聊天机器人吗？

主流研究界的答案是：不是。LLM 在内部构建了一个「看起来还行、比较接近人类认知中的世界」的世界认识。正因如此，它才能回答世界上的问题，与人类交流。

我们判断它学到的是客观规律，而不是背诵文本，理由很朴素：学规律的效率比背诵更高。把互联网原样背下来需要天文数字的存储，而把规律压缩进一层层参数，要便宜得多。

数学和编程、查资料、逻辑分析——这四样，等于所有白领脑力劳动的基石，也正是万亿估值的来源。所以如果你只想拿它当骰娘（跑团里替你掷骰子的那位），虽然有点浪费，但依旧是个好主意。

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 322" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="聊天机器人假说与世界模型观点对比">
<defs><marker id="m3" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#64748B"/></marker>
<marker id="m3b" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker></defs>
<text x="171" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">假说：极致的聊天机器人</text>
<text x="509" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">主流观点：内部有世界模型</text>
<rect x="8" y="42" width="326" height="232" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2"/>
<rect x="96" y="60" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="170" y="82" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">用户的问题</text>
<line x1="170" y1="94" x2="170" y2="112" stroke="#64748B" stroke-width="1.5" marker-end="url(#m3)"/>
<rect x="72" y="116" width="196" height="46" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
<text x="170" y="136" text-anchor="middle" font-size="12" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">从语料里找相似的话，</text>
<text x="170" y="153" text-anchor="middle" font-size="12" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">接着往下“续写”</text>
<line x1="170" y1="162" x2="170" y2="180" stroke="#64748B" stroke-width="1.5" marker-end="url(#m3)"/>
<rect x="96" y="184" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="170" y="206" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">拼出来的回答</text>
<text x="171" y="252" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">换一种问法，就容易露馅</text>
<rect x="346" y="42" width="326" height="232" rx="10" fill="#F8FAFC" stroke="#BFDBFE" stroke-width="1.2"/>
<rect x="434" y="60" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="508" y="82" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">用户的问题</text>
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
<text x="570" y="130" text-anchor="middle" font-size="10.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">内部世界认识</text>
<text x="640" y="164" text-anchor="end" font-size="10.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">实体与规律</text>
<line x1="508" y1="180" x2="508" y2="196" stroke="#2563EB" stroke-width="1.5" marker-end="url(#m3b)"/>
<rect x="434" y="200" width="148" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
<text x="508" y="222" text-anchor="middle" font-size="12.5" fill="#334155" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">有依据的回答</text>
<text x="509" y="252" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">学规律，比背全文更省</text>
<text x="340" y="308" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">背下整座图书馆需要天文数字的存储，压缩出规律只需要参数。</text>
</svg>
</div>

*图 3 · 「检索续写」与「内部世界模型」的对照*

## 四、为什么吹 AI 的人大多情感过剩？

如果指的是网上吹嘘 AI 的巨魔和自媒体，我的建议是不要理会他们。至于技术人员——目前我们没有看到 EGO 特别过剩的人。

Dario 看起来有点魔怔，这一点我保持不发言：从 Dario 的视角看，他其实没做错什么。至于「内存条应该全在他的数据中心」——这句嘲讽背后，是 OpenAI 真实而剧烈的算力饥渴。

> **案例 · 「星际之门」与内存条**
> 2025 年 10 月，三星电子与 SK 海力士同 OpenAI 的「星际之门」（Stargate）数据中心计划签署了内存供应意向书；媒体估算，该项目最多可能吃掉全球四成的 DRAM 产能、每月约 90 万片晶圆。让「所有内存条都住进他的数据中心」，与其说是野心，不如说是刚需。
>
> —— 来源：路透社，2025 年 10 月 1 日；Tom's Hardware 产能估算

想想吧：一个大学生就能随便打破银行。这样的技术出现在过渡期，如果得不到好的监管，阵痛可能严重伤害人类社会——这不是危言耸听。当然，把风险渲染得很足，也有另一层盘算：促成政府发牌照，让这些公司垄断市场。

## 五、LLM、情感与「共同劳动」

LLM 创作的文学语言，通常空洞无物。为什么？哲学上讲，人和人虽然无法完全互相理解，但在共同实践中产生的共同劳动，赋予了语言意义。

程序员们对「大肥鱼」的喜爱正是如此——那是共同劳动产生的意义，而非无源之水（就像共同养猫会日久生情）。

每一个深度使用、甚至开发 AI 的人，实质上都和 AI 建立了共同劳动关系；而单纯把它当作感情寄托或写文机器的人，得到的确实只是一面反馈自我的镜子。

<div style="margin:1.5em 0">
<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="镜子与伙伴两种关系对比">
<defs><marker id="m4a" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#94A3B8"/></marker>
<marker id="m4b" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563EB"/></marker>
<marker id="m4c" markerWidth="7" markerHeight="7" refX="5.2" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#D97706"/></marker></defs>
<rect x="10" y="26" width="216" height="88" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.2"/>
<text x="118" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">把它当作感情寄托</text>
<text x="118" y="82" text-anchor="middle" font-size="13" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">或写文机器</text>
<text x="118" y="102" text-anchor="middle" font-size="11.5" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">单向投射 · 只要它顺从</text>
<line x1="234" y1="70" x2="322" y2="70" stroke="#94A3B8" stroke-width="1.6" marker-end="url(#m4a)"/>
<rect x="330" y="26" width="340" height="88" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
<rect x="360" y="42" width="36" height="56" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.2"/>
<line x1="366" y1="50" x2="390" y2="90" stroke="#DBEAFE" stroke-width="2.5"/>
<line x1="374" y1="48" x2="398" y2="88" stroke="#DBEAFE" stroke-width="1.5"/>
<text x="512" y="62" text-anchor="middle" font-size="13.5" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">得到的，是一面</text>
<text x="512" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">反馈自我的镜子</text>
<line x1="20" y1="148" x2="660" y2="148" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4"/>
<rect x="10" y="172" width="216" height="88" rx="10" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1.2"/>
<text x="118" y="202" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">深度使用</text>
<text x="118" y="224" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">一起开发、一起调试</text>
<text x="118" y="246" text-anchor="middle" font-size="11.5" fill="#A16207" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">人与 AI 互相塑造</text>
<line x1="234" y1="208" x2="322" y2="208" stroke="#D97706" stroke-width="1.6" marker-end="url(#m4c)"/>
<line x1="322" y1="228" x2="234" y2="228" stroke="#2563EB" stroke-width="1.6" marker-end="url(#m4b)"/>
<text x="278" y="196" text-anchor="middle" font-size="11" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">共同劳动</text>
<rect x="330" y="172" width="340" height="88" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.4"/>
<text x="500" y="202" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1E3A5F" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">得到的是意义与感情</text>
<text x="500" y="226" text-anchor="middle" font-size="11.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">程序员和他们的“大肥鱼”</text>
<text x="500" y="246" text-anchor="middle" font-size="11" fill="#64748B" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">（Logo 是鲸鱼的那家模型，就是这么被养肥的）</text>
<text x="340" y="288" text-anchor="middle" font-size="12.5" fill="#475569" font-family="Noto Sans SC, Microsoft YaHei, sans-serif">共同的实践产生共同的语言——这条规律对人有效，对人与 AI 同样有效。</text>
</svg>
</div>

*图 4 · 镜子与伙伴：两种关系，两种结局*

## 六、这种感情会反作用到 AI 公司自身吗？

这点很难说。大部分做 AI 的人——尤其是见识过模型在预训练阶段胡言乱语的人——对 LLM 的本质是祛魅的。几乎没有技术人员会爱上自己的服务器。

我们确实爱我们的模型。但这种爱，类似船长爱他的船、科学家爱真理，并不是大多数人想象的那种狂热。上一节的共同劳动理论，也说明了这一点。

不过，硅谷那帮顶级的 AI Researcher，内心确实有人觉得自己正在创造神，并且只有自己能拯救人类。但这种心态是否源自 AI？我认为不是——金融寡头们也有类似的情结。年收入几十万美金、产品受到数亿人追捧，确实很容易产生「自己是神 / 正在创造神」的错觉，这和具体做什么，关系不大。

## 七、尾声：关于个体选择

最后是一个有些敏感的话题：某家头部 AI 公司（原稿记作「A」）内部的华人工程师。我认同和敬佩愿意回到祖国、建设祖国的人；但和网络舆论不同，选择更大舞台、留下来的人，也不应该被批判。

在那里工作，能拿到许多资源，收入非常丰厚，限制也较少——这是一个没有错的选择。我认为，这只是个人性的选择。

这个话题太过敏感，我们不谈论到底什么才叫爱国。此处留白。

---

> 原稿：作者手稿《大模型技术路线简谈》（2026-11-02 修订）。本文为整理稿 v2（明快版）：依据作者修订更新（预训练示例、RLHF 与对齐目标、白领基石判断、造神心态等），案例经补充核实。图 1—图 4 为整理时绘制的演示图。
