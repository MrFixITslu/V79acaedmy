export type AIMasteryLayer = {
  mentalModel: string[];
  operatorMoves: string[];
  realWorldUse: string;
  microDrill: string[];
  independentTask: string;
  evidenceOfMastery: string[];
  efficiencyMetric: string;
  coachQuestions: string[];
};

export const JUNIOR_AI_MASTERY: Record<number, AIMasteryLayer> = {
  1: {
    mentalModel: [
      'AI is most useful when you give it a clearly bounded job instead of handing over the whole task.',
      'A strong AI user separates the goal, the AI-assisted step, the human-only step and the final decision.',
      'AI output is a draft, option, transformation or analysis—not automatic truth.',
      'The first efficiency gain is choosing the right task before writing a prompt.'
    ],
    operatorMoves: [
      'Name the result you need before opening an AI tool.',
      'Classify the job as generate, summarize, extract, transform, compare, explain, critique or plan.',
      'Give AI only the smallest useful subtask.',
      'Decide how you will verify or judge the result before you generate it.'
    ],
    realWorldUse: 'A student planning a science display can use AI to brainstorm display ideas, but should use trusted sources for facts and make the final design choice themselves.',
    microDrill: [
      'Take one homework task and split it into Human / AI-assisted / Simple-tool steps.',
      'For three sample tasks, name the AI operation: generate, summarize, extract, transform, compare, explain, critique or plan.',
      'Rewrite one “do everything for me” request into one small AI job.'
    ],
    independentTask: 'Choose a new school or home task, decide whether AI belongs in the workflow, and explain your decision before using the tool.',
    evidenceOfMastery: [
      'Learner can explain why AI is useful for one part but not another.',
      'Learner can name the intended AI operation.',
      'Learner plans a human check before seeing the output.'
    ],
    efficiencyMetric: 'Fewer unnecessary AI steps and a clearer division between AI assistance and human judgment.',
    coachQuestions: ['What exact job are you giving AI?', 'What would you still need to decide yourself?', 'Could a simpler tool do this part better?']
  },
  2: {
    mentalModel: [
      'Prompt quality comes from useful information, not maximum word count.',
      'A strong prompt tells AI the task, relevant context, constraints, audience and desired output shape.',
      'Follow-up prompts are usually more efficient than restarting from zero when most of the answer is usable.',
      'Conversation context can become messy; sometimes starting a fresh chat with a clean brief is better than adding more corrections.'
    ],
    operatorMoves: [
      'Use a prompt skeleton: task → context → constraints → output format → quality check.',
      'Give one example when format or style is hard to describe.',
      'Use focused follow-ups such as “keep X; change Y.”',
      'Start a new conversation when old instructions are confusing the task.',
      'Ask for structured output when you need to compare or reuse results.'
    ],
    realWorldUse: 'A learner can turn class notes into a study quiz faster by supplying the notes, limiting the AI to those notes and requesting a fixed question/answer format.',
    microDrill: [
      'Upgrade a vague prompt by adding only the context that changes the answer.',
      'Turn the same request into a bullet list, checklist and table.',
      'Fix one bad answer using a focused follow-up instead of rewriting the full prompt.',
      'Compare a cluttered multi-turn conversation with a clean restart prompt.'
    ],
    independentTask: 'Build one reusable prompt template for a task you expect to repeat, then test it on two different examples.',
    evidenceOfMastery: [
      'Prompt contains a specific task and testable constraints.',
      'Output format makes checking easier.',
      'Learner knows when to continue a conversation and when to restart.',
      'Learner improves one weak part without regenerating everything.'
    ],
    efficiencyMetric: 'Useful output reached in fewer retries, with less repeated instruction and a reusable prompt pattern.',
    coachQuestions: ['Which instruction actually changes the result?', 'What should stay unchanged in your follow-up?', 'Would a fresh chat be clearer now?']
  },
  3: {
    mentalModel: [
      'Every prompt is a data-sharing decision.',
      'Good AI use follows data minimization: give the tool only what it needs.',
      'Identity data—faces, voices, names and personal stories—can be sensitive even when it does not look like a password.',
      'Privacy and permission are part of technical quality, not separate from it.'
    ],
    operatorMoves: [
      'Remove names, addresses, phone numbers, passwords and unnecessary identifying details.',
      'Replace real examples with invented or anonymized versions when possible.',
      'Ask permission before using another person’s face, voice or creative work.',
      'Pause when a task involves sensitive records or a tool that is not approved for them.'
    ],
    realWorldUse: 'Instead of pasting a real classmate’s private message into AI, a learner can describe the communication problem using invented names and only the details needed for advice.',
    microDrill: [
      'Redact a risky prompt until only necessary information remains.',
      'Sort examples into public, private, sensitive and permission-required.',
      'Practice replacing real identity details with neutral placeholders.'
    ],
    independentTask: 'Take a realistic AI task and produce both the unsafe version and a minimized safe version, then explain every removed detail.',
    evidenceOfMastery: [
      'No secrets or unnecessary identifiers are present.',
      'Learner can explain why each retained detail is necessary.',
      'Permission needs are identified before generation.'
    ],
    efficiencyMetric: 'The prompt contains enough information to work well without exposing unnecessary personal data.',
    coachQuestions: ['Does AI actually need this detail?', 'Whose information is this?', 'Could you replace it with an invented example?']
  },
  4: {
    mentalModel: [
      'AI can help organize research but should not be treated as the evidence itself.',
      'A confident sentence is still only a claim until it is supported.',
      'Source quality, date, author/organization and original context matter.',
      'Uncertainty is useful information; a good researcher marks what is known, likely, disputed or still unknown.'
    ],
    operatorMoves: [
      'Ask AI for research questions and keywords before asking for conclusions.',
      'Bring trusted source material into the workflow and tell AI not to go beyond it when appropriate.',
      'Separate claim, evidence and conclusion.',
      'Ask AI to flag uncertainty and missing evidence.',
      'Open and verify cited sources independently.'
    ],
    realWorldUse: 'When researching hurricane preparedness, AI can organize official guidance from trusted agencies, but the learner must verify current instructions from the original sources.',
    microDrill: [
      'Turn a broad topic into three answerable research questions.',
      'Mark five statements as claim, evidence or conclusion.',
      'Ask AI to compare two source excerpts without adding outside facts.',
      'Identify one point that remains uncertain after comparison.'
    ],
    independentTask: 'Investigate one surprising claim, build an evidence table from at least two trustworthy sources and write your own conclusion.',
    evidenceOfMastery: [
      'Important claims link to real evidence.',
      'Dates and source authority are considered.',
      'Learner can say what remains uncertain.',
      'AI is used to organize evidence rather than replace it.'
    ],
    efficiencyMetric: 'Research time is reduced without reducing source quality or hiding uncertainty.',
    coachQuestions: ['What is the claim?', 'What is the original source?', 'What would change your mind?']
  },
  5: {
    mentalModel: [
      'AI tools have different capabilities; the best tool is the one that fits the job, not the most exciting brand.',
      'A calculator, search engine, spreadsheet, camera or human conversation can be better than generative AI.',
      'Efficiency includes review cost: a fast AI answer can be inefficient if checking it takes longer than doing the task another way.',
      'Multimodal AI can work across text, images, audio and files, but every input still needs privacy and quality checks.'
    ],
    operatorMoves: [
      'Identify the capability needed before choosing a tool.',
      'Compare AI with a simple non-AI alternative.',
      'Estimate the amount of checking the result will require.',
      'Use source files or images only when they genuinely improve the task.',
      'Switch tools when the current one cannot reliably perform the needed operation.'
    ],
    realWorldUse: 'Use a spreadsheet for exact totals, AI for explaining trends in the table, and a human to decide what action to take.',
    microDrill: [
      'Choose the best tool for ten different tasks.',
      'For one task, compare AI, search and a calculator/spreadsheet.',
      'Estimate time-to-result plus time-to-check for two approaches.'
    ],
    independentTask: 'Create a small decision guide for choosing between AI, search, calculator/spreadsheet, design tool and human judgment.',
    evidenceOfMastery: [
      'Tool choice is based on capability and risk.',
      'Learner considers verification effort.',
      'Learner can switch away from AI when another tool is better.'
    ],
    efficiencyMetric: 'Best useful result with the least unnecessary tool-switching and verification overhead.',
    coachQuestions: ['What capability do you need?', 'What simpler tool could do this?', 'How much checking will this output require?']
  },
  6: {
    mentalModel: [
      'Image generation is visual instruction-writing: composition and purpose matter as much as style.',
      'The most efficient image workflow changes one variable at a time instead of regenerating randomly.',
      'Reference images, aspect ratio, subject placement and negative constraints can reduce wasted iterations.',
      'Generated imagery can imply false facts even when no false sentence is written.'
    ],
    operatorMoves: [
      'Lock purpose, audience and composition before decorative style.',
      'Specify what must be present, where important elements should sit and what should be avoided.',
      'Generate a small number of purposeful variants.',
      'Compare against a visual checklist before revising.',
      'Add critical text in a design tool when generated lettering is unreliable.'
    ],
    realWorldUse: 'A team creating a reef poster first reserves headline space and chooses a vertical composition, then explores style variations without moving the core elements.',
    microDrill: [
      'Write three prompts for the same image with different compositions.',
      'Change only one visual variable between attempts.',
      'Audit a generated image for factual implication, text errors and composition.'
    ],
    independentTask: 'Create one visual concept adapted deliberately for square, vertical and wide formats.',
    evidenceOfMastery: [
      'Composition matches final use.',
      'Iterations have a reason rather than random retries.',
      'Misleading details are identified and corrected.'
    ],
    efficiencyMetric: 'Fewer regenerations because the learner controls composition and revises one visual problem at a time.',
    coachQuestions: ['Where will this image be used?', 'What should stay fixed between versions?', 'Could this image mislead someone?']
  },
  7: {
    mentalModel: [
      'Writing with AI is strongest as a staged process: ideas → outline → draft → critique → revision.',
      'The learner’s voice comes from choices, examples, phrasing and revision—not from asking AI to imitate a famous writer.',
      'Critique prompts are often more valuable than generation prompts once a draft exists.',
      'Source facts and invented creative details should remain clearly separated.'
    ],
    operatorMoves: [
      'Start with your own notes or intent.',
      'Ask for options before full prose.',
      'Draft in sections when the task is long.',
      'Ask for critique against a rubric instead of “make it better.”',
      'Revise deliberately and fact-check factual statements.'
    ],
    realWorldUse: 'A learner writing a speech can ask AI to critique clarity and pacing against a rubric while keeping the learner’s own examples and final wording.',
    microDrill: [
      'Generate three possible outlines from the same notes.',
      'Choose one and explain why.',
      'Ask AI to critique a paragraph without rewriting it.',
      'Apply only the feedback you agree with.'
    ],
    independentTask: 'Produce a short piece showing your notes, AI-assisted outline, first draft, critique and human revision.',
    evidenceOfMastery: [
      'Learner can identify their own contribution.',
      'Revision follows explicit criteria.',
      'AI critique is evaluated rather than automatically accepted.'
    ],
    efficiencyMetric: 'Less time spent staring at a blank page and fewer full rewrites because AI supports specific stages.',
    coachQuestions: ['What stage are you in right now?', 'Do you need generation or critique?', 'Which suggestion did you reject, and why?']
  },
  8: {
    mentalModel: [
      'Audio is a timing problem as well as a writing problem.',
      'A clear script should be tested aloud before voice, music or effects are finalized.',
      'Transcription and summarization can make audio easier to reuse, search and review.',
      'Voice identity requires permission just like a photograph does.'
    ],
    operatorMoves: [
      'Convert duration into an approximate word budget.',
      'Lock the message before selecting effects or voice.',
      'Test pronunciation, pacing and volume on a short sample.',
      'Use transcription to check what was actually understandable.',
      'Keep a text script as the source of truth.'
    ],
    realWorldUse: 'A 30-second school announcement can be drafted, timed aloud, shortened, recorded, transcribed and compared with the intended script.',
    microDrill: [
      'Time a 70-word script aloud.',
      'Revise it to fit a target duration.',
      'Compare the recording transcript to the intended words.',
      'Identify one place sound design improves meaning and one where it distracts.'
    ],
    independentTask: 'Create the same message as a short narration and a radio-style announcement, then compare which structure works better.',
    evidenceOfMastery: [
      'Script fits time.',
      'Full audio was reviewed.',
      'Voice/identity permissions are appropriate.',
      'Transcript or playback check confirms clarity.'
    ],
    efficiencyMetric: 'Less re-recording because timing and message are solved before final audio production.',
    coachQuestions: ['How many words fit the time?', 'What is the source-of-truth script?', 'Did you listen to the whole result?']
  },
  9: {
    mentalModel: [
      'Video generation is expensive in time and iteration, so pre-production creates the biggest efficiency gain.',
      'Every scene should have one communication job.',
      'Consistency requires a reusable scene/character specification.',
      'Synthetic footage must not be confused with documentary evidence.'
    ],
    operatorMoves: [
      'Lock the message and duration first.',
      'Plan scenes before generating clips.',
      'Reuse a continuity sheet for recurring subjects and style.',
      'Test one representative scene before producing the full sequence.',
      'Review with sound on, sound off and captions visible.'
    ],
    realWorldUse: 'A team tests one 6-second scene for a reef campaign before generating all six scenes, avoiding a full set of inconsistent clips.',
    microDrill: [
      'Give each storyboard scene one sentence describing its job.',
      'Create a continuity sheet for a recurring character.',
      'Test one scene and record what must stay consistent.',
      'Audit captions and pacing separately from visuals.'
    ],
    independentTask: 'Plan a 45-second video, then redesign it for 15 seconds by removing ideas rather than merely speeding it up.',
    evidenceOfMastery: [
      'Storyboard exists before full generation.',
      'Scene purpose is clear.',
      'Consistency requirements are documented.',
      'Synthetic content is honestly presented.'
    ],
    efficiencyMetric: 'Production effort is concentrated on approved scenes instead of discarded random generations.',
    coachQuestions: ['What job does this scene do?', 'What details must stay consistent?', 'Could you test one scene before making the rest?']
  },
  10: {
    mentalModel: [
      'Presentations are arguments or explanations supported by evidence—not collections of decorated slides.',
      'AI is useful for grouping and compressing information after the evidence is known.',
      'A slide objective tells you what the audience should understand at that moment.',
      'Speaker notes and slides serve different jobs.'
    ],
    operatorMoves: [
      'Write the audience outcome first.',
      'Group verified evidence into a small number of ideas.',
      'Create one objective per slide.',
      'Move explanation detail to notes instead of shrinking text.',
      'Use AI to critique flow and redundancy after the outline exists.'
    ],
    realWorldUse: 'A learner turns verified research into six slide objectives before selecting any theme or decorative imagery.',
    microDrill: [
      'Convert a paragraph into one slide objective and three bullets.',
      'Delete one slide that does not support the final goal.',
      'Ask AI to identify duplicated ideas across a slide outline.',
      'Practice a timed explanation using notes, not slide text.'
    ],
    independentTask: 'Create both a 3-slide briefing and an 8-slide presentation from the same evidence.',
    evidenceOfMastery: [
      'Every slide has a purpose.',
      'Evidence is traceable.',
      'Learner can speak without reading paragraphs.',
      'Slide count reflects time and audience.'
    ],
    efficiencyMetric: 'Less time spent designing slides that later get deleted because structure is approved first.',
    coachQuestions: ['What should the audience understand after this slide?', 'Could this detail move to speaker notes?', 'Which slide earns the least space?']
  },
  11: {
    mentalModel: [
      'Content repurposing is transformation: the facts remain stable while format, hook and length change.',
      'Generating many variants is only useful if there is a selection rule.',
      'Brand voice is a constraint, not permission to exaggerate facts.',
      'A/B-style comparison teaches learners to evaluate options instead of trusting the first output.'
    ],
    operatorMoves: [
      'Freeze approved facts before generating promotional variants.',
      'Name the audience and desired action.',
      'Generate a small number of meaningfully different options.',
      'Score variants against clarity, truthfulness and audience fit.',
      'Repurpose the winner into other formats.'
    ],
    realWorldUse: 'One verified event notice becomes a poster headline, caption and announcement without changing date, time, location or promise.',
    microDrill: [
      'Lock five facts that must not change.',
      'Generate three hooks with different angles.',
      'Score them with a rubric.',
      'Transform the winner into two new formats and verify facts stayed fixed.'
    ],
    independentTask: 'Create a four-format mini campaign from one approved message and show the factual consistency check.',
    evidenceOfMastery: [
      'Variants differ in approach, not in facts.',
      'Selection uses explicit criteria.',
      'Call to action matches the audience.',
      'No generated variant is published automatically.'
    ],
    efficiencyMetric: 'One approved source message supports multiple formats without repeated research or factual drift.',
    coachQuestions: ['Which facts are locked?', 'How will you choose among variants?', 'Did the transformation change any claim?']
  },
  12: {
    mentalModel: [
      'Complex AI work becomes reliable when it is decomposed into stages with clear inputs and outputs.',
      'A handoff should contain only the information the next step needs.',
      'Context compression—turning a long history into a concise approved brief—prevents instruction drift.',
      'Quality gates stop one bad output from contaminating the rest of the workflow.'
    ],
    operatorMoves: [
      'Define the final output and work backwards.',
      'Assign Human / AI / Simple tool to each step.',
      'Specify structured handoff formats.',
      'Summarize approved context before moving into a new long conversation.',
      'Add checks after high-risk steps.',
      'Save reusable templates and compare time/quality.'
    ],
    realWorldUse: 'A researched video workflow hands a verified fact table into the script stage rather than passing an entire messy chat history forward.',
    microDrill: [
      'Turn a messy multi-step task into five stages.',
      'Define the exact output schema for one handoff.',
      'Compress a page of notes into a short approved brief.',
      'Identify where an error would spread if not caught.'
    ],
    independentTask: 'Build and test a reusable AI-assisted workflow for a real recurring task, then compare it with your previous method.',
    evidenceOfMastery: [
      'Workflow has clear owners and handoffs.',
      'Context passed forward is concise and approved.',
      'At least one quality gate catches a possible failure.',
      'Learner can say whether the workflow actually saved time.'
    ],
    efficiencyMetric: 'Repeated tasks take fewer prompts and less rework because successful handoffs and checks are reusable.',
    coachQuestions: ['What does the next step actually need?', 'Where could an error spread?', 'Can you compress this context before continuing?']
  },
  13: {
    mentalModel: [
      'AI is good at widening the option space; humans must define the problem and choose decision criteria.',
      'A solution should test an uncertainty rather than merely look impressive.',
      'Constraints improve ideas by making tradeoffs visible.',
      'Feedback becomes useful when it changes a decision or task.'
    ],
    operatorMoves: [
      'Write the problem without naming the solution.',
      'Ask for genuinely different options.',
      'Define human criteria before scoring options.',
      'Prototype the smallest useful version.',
      'Turn feedback into a specific revision decision.'
    ],
    realWorldUse: 'Instead of immediately building an app, a team explores reminder, routine, environment and incentive solutions to a school problem.',
    microDrill: [
      'Rewrite a solution statement as a problem statement.',
      'Generate six options from at least three categories.',
      'Build a three-criterion decision matrix.',
      'Change one constraint and see how the ranking changes.'
    ],
    independentTask: 'Solve the same problem under two different constraints and explain why the best solution changes.',
    evidenceOfMastery: [
      'Multiple approaches are considered.',
      'Criteria come from human goals.',
      'Prototype tests a real unknown.',
      'Feedback leads to an explicit decision.'
    ],
    efficiencyMetric: 'Less time is wasted polishing the first idea before knowing whether it fits the problem.',
    coachQuestions: ['What problem are you actually solving?', 'What are your decision criteria?', 'What is the smallest test that could teach you something?']
  },
  14: {
    mentalModel: [
      'AI can organize business thinking, but it cannot prove customer demand simply by generating a convincing story.',
      'Assumptions should be turned into questions that real evidence can answer.',
      'A value proposition connects a specific audience, problem and useful offer.',
      'Numbers, testimonials and claims require real evidence and adult oversight.'
    ],
    operatorMoves: [
      'Separate facts from assumptions.',
      'Use AI to generate validation questions instead of fake market answers.',
      'Draft offers from known capabilities.',
      'Keep financial numbers sourced or explicitly labeled as estimates.',
      'Use AI to stress-test the offer with objections and edge cases.'
    ],
    realWorldUse: 'A supervised poster-design service uses AI to draft interview questions and FAQs, then validates interest with real school clubs.',
    microDrill: [
      'Mark a one-page business idea as fact vs assumption.',
      'Turn five assumptions into interview or research questions.',
      'Ask AI to generate customer objections rather than praise.',
      'Revise the offer based on one real response.'
    ],
    independentTask: 'Create a mini-offer and a validation plan that can prove or disprove its three biggest assumptions.',
    evidenceOfMastery: [
      'Demand is not invented.',
      'Assumptions are visible.',
      'Claims and estimates are labeled honestly.',
      'AI supports planning rather than pretending to be the market.'
    ],
    efficiencyMetric: 'Learner tests important assumptions before spending time creating a polished but unsupported offer.',
    coachQuestions: ['What do you know versus assume?', 'How could you test this with real evidence?', 'What claim would be risky to publish without proof?']
  },
  15: {
    mentalModel: [
      '“Is this good?” is an inefficient quality prompt because quality must be defined.',
      'Acceptance criteria turn subjective review into a repeatable check.',
      'AI can flag possible defects, but a human must verify factual, ethical and real-world behavior.',
      'Release decisions should prioritize high-impact failures over cosmetic issues.'
    ],
    operatorMoves: [
      'Turn requirements into a checklist or rubric.',
      'Ask AI for pass/needs-work plus evidence.',
      'Require the AI to say “cannot verify” when evidence is missing.',
      'Verify high-impact flags manually.',
      'Fix in risk/impact order and run a final audience test.'
    ],
    realWorldUse: 'A team audits a campaign against factual support, privacy, accessibility, clarity and consistency before release.',
    microDrill: [
      'Turn a vague goal into five acceptance criteria.',
      'Run a structured audit on a flawed sample.',
      'Rank found problems by impact.',
      'Verify one AI-raised concern manually.'
    ],
    independentTask: 'Create a reusable quality gate for any future AI-assisted school assignment.',
    evidenceOfMastery: [
      'Quality criteria are explicit before review.',
      'AI distinguishes evidence from uncertainty.',
      'High-impact errors are fixed first.',
      'Human approval remains final.'
    ],
    efficiencyMetric: 'Review becomes faster because defects are checked against a stable rubric rather than repeated vague opinions.',
    coachQuestions: ['What does “good” mean here?', 'Which criterion failed?', 'What can the AI not verify by itself?']
  },
  16: {
    mentalModel: [
      'Real AI skill is transferable: the learner should succeed on a new task without copying a class example.',
      'A personal playbook turns course experience into reusable operating procedures.',
      'A strong AI user can explain both when to use AI and when not to.',
      'The final benchmark is process quality: define, choose, prompt, check, improve and save.'
    ],
    operatorMoves: [
      'Select reusable prompts by purpose, not by tool brand.',
      'Document when each template should and should not be used.',
      'Keep verification, privacy and quality rules beside prompt templates.',
      'Test the playbook on a new task.',
      'Explain your process without relying on the AI to speak for you.'
    ],
    realWorldUse: 'A graduate receives an unfamiliar task, chooses the right AI operation, creates a clean prompt, verifies the result, improves it and saves the reusable pattern.',
    microDrill: [
      'Sort your best prompts by generate/summarize/extract/transform/compare/explain/critique/plan.',
      'Delete templates that are too specific to reuse.',
      'Add a “check before use” rule to every important template.',
      'Test one saved workflow on a new topic.'
    ],
    independentTask: 'Complete the AI Operator Benchmark: solve a brand-new task using the full DEFINE → CHOOSE → PROMPT → CHECK → IMPROVE → SAVE loop and explain every decision.',
    evidenceOfMastery: [
      'Learner selects an appropriate AI operation/tool.',
      'Prompt is concise, contextual and testable.',
      'Output is verified with explicit criteria.',
      'Focused iteration improves the weak part.',
      'A reusable pattern is saved.',
      'Learner can name a situation where AI should not be used.'
    ],
    efficiencyMetric: 'A new task can be completed with fewer blind retries, clear checking and a reusable result/workflow.',
    coachQuestions: ['What did you reuse from your playbook?', 'What did you have to adapt?', 'How do you know the final result is good enough?']
  }
};
