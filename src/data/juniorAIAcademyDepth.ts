export type AIDepthLesson = {
  efficiencySkill: string;
  vocabulary: string[];
  whenToUseAI: string[];
  whenNotToUseAI: string[];
  method: string[];
  workedExample: {
    task: string;
    weak: string;
    stronger: string;
    whyBetter: string[];
  };
  promptPattern: string;
  commonMistakes: Array<{ mistake: string; fix: string }>;
  guidedPractice: string[];
  transferChallenge: string;
  qualityCheck: string[];
  reflection: string;
};

export const JUNIOR_AI_DEPTH: Record<number, AIDepthLesson> = {
  1: {
    efficiencySkill: 'Decide what job AI should do before opening an AI tool.',
    vocabulary: ['AI system', 'input', 'output', 'pattern', 'prediction', 'generation', 'human judgment'],
    whenToUseAI: [
      'Brainstorming several possibilities quickly.',
      'Explaining an idea in a different way.',
      'Drafting, organizing or transforming information you will still review.',
      'Finding patterns or generating examples that a human can check.'
    ],
    whenNotToUseAI: [
      'When the answer must be guaranteed correct and you cannot verify it.',
      'When the task requires a trusted adult, professional or emergency service.',
      'When you would need to share private information to get the result.',
      'When doing the thinking yourself is the learning goal.'
    ],
    method: [
      'Name the goal in one sentence.',
      'Choose a small job for AI instead of asking it to “do everything.”',
      'Give only the information AI actually needs.',
      'Inspect the result instead of assuming it is true.',
      'Make the final human decision.'
    ],
    workedExample: {
      task: 'A learner wants ideas for a class recycling campaign.',
      weak: '“Do my recycling project.”',
      stronger: '“Give me five simple recycling-campaign ideas for a primary-school class. For each idea, tell me the goal, one activity and one thing students would need. Keep each idea under 40 words.”',
      whyBetter: [
        'The human keeps ownership of the project.',
        'The AI job is clear: generate options, not complete everything.',
        'Audience and output format are specified.',
        'The result will be easier to compare.'
      ]
    },
    promptPattern: '“Help me with this part of the task: ___. The goal is ___. Give me ___ options in ___ format. I will check and choose the final answer.”',
    commonMistakes: [
      { mistake: 'Treating AI like a person who “knows” everything.', fix: 'Think of AI as a pattern-based tool whose outputs still need checking.' },
      { mistake: 'Asking AI to complete the whole assignment.', fix: 'Give AI one useful subtask and keep the important thinking with the learner.' },
      { mistake: 'Believing confident language equals truth.', fix: 'Separate confidence from evidence.' }
    ],
    guidedPractice: [
      'Pick one school task and circle the part AI could help with.',
      'Name one part a human should still decide.',
      'Try one prompt that asks AI for options rather than a final answer.',
      'Explain what you would check before using the output.'
    ],
    transferChallenge: 'Choose a task from home, school or a hobby and explain whether AI would make it faster, better, neither, or possibly worse.',
    qualityCheck: ['The AI job is small and clear.', 'No private information is required.', 'A human check is planned.', 'The learner can explain the final choice.'],
    reflection: 'What is one task where AI would save you time, and one task where using AI would reduce your learning?'
  },
  2: {
    efficiencySkill: 'Build prompts that include goal, context, constraints and output format—and refine only what needs changing.',
    vocabulary: ['prompt', 'context', 'constraint', 'audience', 'output format', 'example', 'iteration', 'follow-up'],
    whenToUseAI: [
      'Generating, summarizing, extracting, transforming, comparing or explaining information.',
      'Creating first drafts that will be revised.',
      'Producing several options under clear constraints.'
    ],
    whenNotToUseAI: [
      'When you cannot describe what a good answer would look like.',
      'When the prompt would contain private or secret information.',
      'When a teacher specifically wants unaided practice.'
    ],
    method: [
      'State the mission: what should AI do?',
      'Add only the context needed for the task.',
      'Name the audience and important constraints.',
      'Request a useful output format such as bullets, checklist, table or short paragraph.',
      'Inspect the result and change one weak part at a time.',
      'Save prompts that work so you can reuse the structure.'
    ],
    workedExample: {
      task: 'Turn notes about sea turtles into a study aid.',
      weak: '“Help me study sea turtles.”',
      stronger: '“Using the notes below, create a five-question quiz for a 10-year-old. Use only facts in my notes. Include four multiple-choice questions and one short-answer question. Put the answer key after the quiz.”',
      whyBetter: [
        'The source of truth is clear.',
        'The audience is clear.',
        'The output format is specified.',
        'The prompt limits the AI from adding outside facts.'
      ]
    },
    promptPattern: 'MAGIC+: “My mission is ___. The audience is ___. Here is the context: ___. Include ___. Do not ___. Return the answer as ___. Then check whether you followed every instruction.”',
    commonMistakes: [
      { mistake: 'Adding lots of words that do not affect the result.', fix: 'Keep only context that changes what AI should produce.' },
      { mistake: 'Rewriting the entire prompt after one weak detail.', fix: 'Use a follow-up such as “Keep everything else; make the examples simpler.”' },
      { mistake: 'Requesting “something good” without defining quality.', fix: 'Name concrete criteria: length, audience, tone, format, facts, examples.' }
    ],
    guidedPractice: [
      'Write one weak prompt with fewer than eight words.',
      'Upgrade it using mission, audience, details, style and output format.',
      'Run or role-play both prompts and compare the results.',
      'Use a follow-up prompt to improve exactly one problem.',
      'Save the final prompt as a reusable template.'
    ],
    transferChallenge: 'Create one prompt pattern each for summarize, extract, transform, compare and generate.',
    qualityCheck: ['Goal is explicit.', 'Useful context is present.', 'Constraints are testable.', 'Output format is named.', 'Follow-up changes are focused.'],
    reflection: 'Which part of your prompt changed the result the most: context, constraints, audience or format?'
  },
  3: {
    efficiencySkill: 'Protect data and identities before using AI, and choose the minimum information needed.',
    vocabulary: ['privacy', 'personal information', 'consent', 'identity', 'data minimization', 'permission', 'attribution'],
    whenToUseAI: [
      'With public, invented or instructor-approved information.',
      'When faces, voices or personal details are not required.',
      'When you can remove identifying details from an example.'
    ],
    whenNotToUseAI: [
      'With passwords, login codes or private security information.',
      'With another child’s private story, photo or voice without appropriate permission.',
      'With sensitive records that the tool is not approved to handle.'
    ],
    method: [
      'STOP before prompting: Secrets, Telephone/address, Online passwords, Personal information.',
      'Ask: “Does AI actually need this detail?”',
      'Replace real names and private details with neutral examples when possible.',
      'Get permission before using another person’s identity or creative work.',
      'Record where AI materially helped so you can be honest about it.'
    ],
    workedExample: {
      task: 'Ask AI to help rewrite a message about a school club.',
      weak: '“Rewrite this. My friend Jayden lives at 17 Example Road and his phone is 555-0102…”',
      stronger: '“Rewrite this friendly school-club reminder for a classmate. Remove all private contact details. Keep it under 70 words and end with a reminder to ask the teacher for the meeting information.”',
      whyBetter: ['Private information is removed.', 'The task does not require a real identity.', 'The output has a safe next step.']
    },
    promptPattern: '“Before answering, tell me whether the information I provided appears to contain private details. If it does, stop and tell me what kind of detail I should remove.”',
    commonMistakes: [
      { mistake: 'Sharing information because “AI already knows things.”', fix: 'Treat every prompt as information you are actively choosing to send.' },
      { mistake: 'Using a friend’s face or voice because it is “just for fun.”', fix: 'Get appropriate permission and consider how the result could be reused.' },
      { mistake: 'Copying AI output without disclosing meaningful assistance.', fix: 'Use simple attribution appropriate to the activity.' }
    ],
    guidedPractice: [
      'Mark ten sample details as safe, ask-an-adult, or do-not-share.',
      'Rewrite a risky prompt so it contains only necessary information.',
      'Create a one-sentence AI-use credit for a class project.',
      'Practice refusing a request that would misuse another person’s identity.'
    ],
    transferChallenge: 'Take a real task and rewrite the prompt so it uses the least personal information possible.',
    qualityCheck: ['No secrets or credentials.', 'No unnecessary identifying information.', 'Permission exists where needed.', 'AI assistance can be explained honestly.'],
    reflection: 'What information did you remove from a prompt because AI did not actually need it?'
  },
  4: {
    efficiencySkill: 'Use AI to organize research questions and evidence without treating AI itself as the evidence.',
    vocabulary: ['claim', 'evidence', 'source', 'primary source', 'secondary source', 'citation', 'corroboration', 'current'],
    whenToUseAI: [
      'Generating research questions and keywords.',
      'Summarizing a source you already have access to.',
      'Comparing claims across sources you provide.',
      'Turning verified notes into a study guide or outline.'
    ],
    whenNotToUseAI: [
      'As the only source for an important factual claim.',
      'To invent citations or sources.',
      'When current information is essential but no current source can be checked.'
    ],
    method: [
      'Start with a question, not a conclusion.',
      'Ask AI for search terms or sub-questions.',
      'Find sources outside the AI answer.',
      'Record claim, source, author/organization and date.',
      'Compare at least two sources for important claims.',
      'Use AI to summarize only after you know which source is being summarized.',
      'Write the conclusion from the evidence.'
    ],
    workedExample: {
      task: 'Research whether a Caribbean animal is endangered.',
      weak: '“Is this animal endangered? Give me facts.”',
      stronger: '“Help me plan research on whether the hawksbill turtle is endangered. Give me five search questions and keywords. Do not answer the questions for me. After I bring back sources, help me compare what each source says.”',
      whyBetter: ['AI organizes the research without becoming the evidence.', 'The learner gathers sources.', 'The workflow reduces invented citations.']
    },
    promptPattern: '“Here are two source notes. Make a table with: claim, source A evidence, source B evidence, agreement/disagreement, date concern, and what still needs checking. Do not add facts not present in my notes.”',
    commonMistakes: [
      { mistake: 'Asking AI for “sources” and trusting every citation.', fix: 'Open and verify the source independently.' },
      { mistake: 'Using a search snippet as full evidence.', fix: 'Read enough of the source to understand context.' },
      { mistake: 'Ignoring publication date.', fix: 'Check whether the topic changes over time.' }
    ],
    guidedPractice: [
      'Turn one broad topic into three research questions.',
      'Generate search keywords, then find instructor-approved sources.',
      'Make an evidence table for one claim.',
      'Ask AI to compare only the notes you provide.',
      'Write your own conclusion and cite the evidence.'
    ],
    transferChallenge: 'Fact-check one surprising AI claim and document exactly how you decided whether to trust it.',
    qualityCheck: ['Important claims have external evidence.', 'Sources can be opened.', 'Dates are considered.', 'AI did not invent missing evidence.', 'Conclusion matches sources.'],
    reflection: 'What did checking the original source reveal that the AI answer did not?'
  },
  5: {
    efficiencySkill: 'Choose the right AI use case and tool type instead of using AI for every task.',
    vocabulary: ['use case', 'tool selection', 'strength', 'limitation', 'automation', 'human expertise', 'trade-off'],
    whenToUseAI: [
      'When speed, options, transformation or pattern-finding add value.',
      'When a human can review the result.',
      'When the task is repetitive but still benefits from human checks.'
    ],
    whenNotToUseAI: [
      'When empathy, accountability or professional judgment is the core task.',
      'When a simple calculator, search, checklist or human conversation would be better.',
      'When AI would add more checking work than it saves.'
    ],
    method: [
      'Name the task.',
      'Ask whether AI is better than a simpler tool.',
      'Choose the AI capability needed: text, image, audio, video, analysis or planning.',
      'Estimate what must be checked afterward.',
      'Use AI only if the expected benefit is greater than the extra checking.'
    ],
    workedExample: {
      task: 'A learner needs the total cost of three items and a catchy poster slogan.',
      weak: '“Use AI for everything.”',
      stronger: 'Use a calculator for the exact arithmetic; use AI to brainstorm slogan options; human checks the arithmetic and chooses the slogan.',
      whyBetter: ['Different tools are matched to different jobs.', 'Exact calculation is not delegated unnecessarily.', 'AI is used where variation is useful.']
    },
    promptPattern: '“I need to complete this task: ___. Break it into parts. For each part, suggest whether I should use AI, a simple tool, a trusted source, or human judgment, and explain why.”',
    commonMistakes: [
      { mistake: 'Using AI because it is available, not because it helps.', fix: 'Compare AI with simpler tools first.' },
      { mistake: 'Choosing tools by brand instead of capability.', fix: 'Start with the job: text, image, research, planning, audio, video or analysis.' },
      { mistake: 'Ignoring review cost.', fix: 'Include the time needed to verify the result.' }
    ],
    guidedPractice: [
      'Sort ten tasks into AI useful / simple tool better / human first.',
      'Choose one career and map three useful AI tasks and three human-only responsibilities.',
      'Compare two ways to complete the same task and identify which is faster and safer.'
    ],
    transferChallenge: 'Create a personal “AI or not?” decision card you can use before future tasks.',
    qualityCheck: ['Tool matches the job.', 'Human responsibility is named.', 'Verification effort is considered.', 'Simpler alternatives were considered.'],
    reflection: 'What is one task you previously would have given to AI that a simpler tool can handle better?'
  },
  6: {
    efficiencySkill: 'Direct image generation with visual constraints, iterate deliberately and verify what the image implies.',
    vocabulary: ['subject', 'composition', 'camera/viewpoint', 'lighting', 'mood', 'style', 'aspect ratio', 'iteration'],
    whenToUseAI: ['Concept art, story illustrations, posters, mood boards and fictional scenes.', 'Rapidly exploring several visual directions.'],
    whenNotToUseAI: ['As proof that a real event happened.', 'To create deceptive images of real people.', 'When exact technical/scientific accuracy is required without verification.'],
    method: [
      'Define purpose and audience.',
      'Specify subject and action.',
      'Describe environment, composition and important details.',
      'Choose mood/style only when it supports the purpose.',
      'Request useful dimensions/aspect ratio when the tool supports it.',
      'Compare variations and change one visual variable at a time.',
      'Inspect hands, text, objects and factual details before use.'
    ],
    workedExample: {
      task: 'Create a reef-awareness poster image.',
      weak: '“Make a nice ocean image.”',
      stronger: '“Create a bright educational illustration for children showing a healthy Caribbean coral reef, one sea turtle in the foreground, colorful fish in the middle distance, clear blue water and open space at the top for a headline. Friendly illustrated style, vertical poster composition.”',
      whyBetter: ['Purpose and audience guide the design.', 'Composition reserves space for text.', 'Important visual elements are specified.', 'The prompt avoids pretending the image is documentary evidence.']
    },
    promptPattern: '“Create [visual type] for [audience/purpose]. Show [subject + action] in [setting]. Composition: ___. Mood/lighting: ___. Important details: ___. Leave space for ___. Avoid misleading real-world claims.”',
    commonMistakes: [
      { mistake: 'Stuffing every possible detail into one image.', fix: 'Prioritize the 3–5 details that matter most.' },
      { mistake: 'Trying to fix composition by regenerating everything randomly.', fix: 'Change one constraint at a time.' },
      { mistake: 'Trusting generated text inside images.', fix: 'Add important wording separately in a design tool.' }
    ],
    guidedPractice: ['Create three prompt versions with different composition choices.', 'Compare which one best fits the audience.', 'Identify one visual error or ambiguity.', 'Revise only the weak element.'],
    transferChallenge: 'Turn the same concept into a square thumbnail, vertical poster and wide presentation image by changing composition instructions.',
    qualityCheck: ['Image supports the purpose.', 'Composition fits where it will be used.', 'No misleading implication.', 'Visible errors are checked.', 'Human selected and refined the final version.'],
    reflection: 'Which single prompt change improved your image the most?'
  },
  7: {
    efficiencySkill: 'Use AI in stages—ideate, outline, draft, critique and revise—rather than asking for one finished piece.',
    vocabulary: ['brainstorm', 'outline', 'draft', 'revision', 'tone', 'voice', 'critique', 'transformation'],
    whenToUseAI: ['Generating options, organizing ideas, simplifying or rewriting your own material.', 'Giving critique against a rubric.', 'Turning notes into a structured first draft.'],
    whenNotToUseAI: ['To replace the learner’s own thinking in an assignment where writing is the skill being assessed.', 'To copy a living creator’s distinctive work.', 'To invent facts or quotations.'],
    method: [
      'Start with your own idea or notes.',
      'Ask AI for options or an outline.',
      'Choose the direction yourself.',
      'Draft in sections instead of requesting everything at once.',
      'Ask for critique against clear criteria.',
      'Revise in your own voice.',
      'Fact-check any factual statements.'
    ],
    workedExample: {
      task: 'Write a short story about a robot helping a reef.',
      weak: '“Write me a perfect story about a robot and a reef.”',
      stronger: '“Here is my story idea: a nervous repair robot discovers coral bleaching. Give me three possible problems the robot could face and three endings. Do not write the full story. Keep the ideas suitable for ages 8–10.”',
      whyBetter: ['The learner keeps authorship.', 'AI expands possibilities instead of replacing the creative task.', 'Audience is defined.']
    },
    promptPattern: '“Act as an editor, not a ghostwriter. Here is my draft: ___. Check it for [clarity/tone/structure]. Give me three specific suggestions and explain why. Do not rewrite the whole piece unless I ask.”',
    commonMistakes: [
      { mistake: 'Accepting polished AI writing that does not sound like the learner.', fix: 'Use AI for structure/critique, then rewrite key lines yourself.' },
      { mistake: 'Asking for an entire long piece before planning.', fix: 'Work outline → section → review → revise.' },
      { mistake: 'Keeping invented quotations or statistics.', fix: 'Remove or verify every factual claim.' }
    ],
    guidedPractice: ['Generate options.', 'Choose one and explain why.', 'Create an outline.', 'Draft one section.', 'Ask AI for critique only.', 'Revise and compare before/after.'],
    transferChallenge: 'Use the same staged workflow for a story, explanation and email-style message.',
    qualityCheck: ['Learner can explain core ideas.', 'Structure is intentional.', 'Voice is human-edited.', 'Facts are checked.', 'AI role is transparent.'],
    reflection: 'At which stage did AI help most: ideas, organization, drafting, critique or revision?'
  },
  8: {
    efficiencySkill: 'Plan audio with script, timing and purpose before generating or recording sound.',
    vocabulary: ['script', 'narration', 'sound effect', 'music bed', 'pace', 'transcription', 'consent', 'mix'],
    whenToUseAI: ['Drafting scripts, cleaning structure, generating safe sound concepts, transcription and summarization.', 'Creating practice narration using approved voices/tools.'],
    whenNotToUseAI: ['Cloning or imitating a real person without permission.', 'Publishing generated audio without listening through the whole result.'],
    method: [
      'Define audience and exact duration.',
      'Write the message before choosing effects.',
      'Estimate words for the available time.',
      'Mark where music/SFX actually support meaning.',
      'Create or record a short test.',
      'Listen for clarity, pronunciation, volume and unwanted content.',
      'Keep a backup script even if a generator fails.'
    ],
    workedExample: {
      task: 'Create a 30-second radio message about reducing litter.',
      weak: '“Make a radio ad about litter.”',
      stronger: '“Draft a 65–75 word radio script for students ages 9–12 about keeping school grounds clean. Structure it as: 5-second hook, two simple actions, 5-second call to action. Use an encouraging tone. Do not shame people.”',
      whyBetter: ['Duration is translated into a practical word limit.', 'Structure is specified.', 'Tone and ethical constraint are clear.']
    },
    promptPattern: '“Create a [duration] audio script for [audience]. Goal: ___. Structure: ___. Tone: ___. Include: ___. Avoid: ___. Mark optional SFX in brackets.”',
    commonMistakes: [
      { mistake: 'Choosing voice/music before the message is clear.', fix: 'Lock the script purpose first.' },
      { mistake: 'Generating an audio clip and never listening from start to finish.', fix: 'Full playback is part of quality control.' },
      { mistake: 'Using a recognizable real voice without permission.', fix: 'Use approved voices or record with consent.' }
    ],
    guidedPractice: ['Write a 20-second script.', 'Estimate timing.', 'Read it aloud with a stopwatch.', 'Revise for pace.', 'Add only one useful sound effect.', 'Record/generate and review.'],
    transferChallenge: 'Convert one written project message into a podcast intro, radio announcement and narration script.',
    qualityCheck: ['Message fits duration.', 'Speech is understandable.', 'Audio choices support meaning.', 'Permission is clear.', 'Full output was reviewed.'],
    reflection: 'What did timing your script reveal that reading it silently did not?'
  },
  9: {
    efficiencySkill: 'Use AI to pre-produce video—concept, storyboard, shot list and assets—before spending time on final generation/editing.',
    vocabulary: ['storyboard', 'shot', 'scene', 'continuity', 'caption', 'B-roll', 'pacing', 'synthetic media'],
    whenToUseAI: ['Brainstorming scenes, creating storyboards, drafting narration, generating supporting visuals and captions.', 'Exploring versions before production.'],
    whenNotToUseAI: ['To fabricate documentary evidence.', 'To imitate a real person deceptively.', 'To skip checking whether scenes tell a coherent story.'],
    method: [
      'Write one-sentence video goal.',
      'Break it into 4–6 scenes.',
      'Give each scene one job.',
      'Create a shot list with visual + narration + text.',
      'Generate or gather assets scene by scene.',
      'Check visual continuity and factual accuracy.',
      'Add captions and review with sound on and off.'
    ],
    workedExample: {
      task: 'Make a 45-second reef-awareness video.',
      weak: '“Make me a 45-second reef video.”',
      stronger: '“Create a six-scene storyboard for a 45-second reef-awareness video for children. For each scene provide: purpose, visual, narration (max 15 words) and on-screen text (max 6 words). Use only these verified facts: ___. End with one realistic action.”',
      whyBetter: ['The video is planned before asset generation.', 'Facts are constrained to verified notes.', 'Scene-level limits make editing easier.']
    },
    promptPattern: '“Turn this message into a [number]-scene storyboard. Each scene needs: purpose, visual description, narration limit, on-screen text limit, and transition. Keep one idea per scene.”',
    commonMistakes: [
      { mistake: 'Generating disconnected clips first and trying to invent a story later.', fix: 'Storyboard before generating assets.' },
      { mistake: 'Too much narration per scene.', fix: 'Set word limits and one idea per scene.' },
      { mistake: 'Changing character/visual details accidentally across scenes.', fix: 'Keep a continuity sheet with recurring details.' }
    ],
    guidedPractice: ['Write a six-scene storyboard.', 'Generate one test scene.', 'Check whether it matches the storyboard.', 'Revise the visual prompt.', 'Build remaining scenes only after the style works.'],
    transferChallenge: 'Adapt the same message into a 15-second, 45-second and 90-second structure without simply speaking faster.',
    qualityCheck: ['Every scene has a job.', 'Facts are verified.', 'Visuals are consistent.', 'Captions are readable.', 'Synthetic content is not misleading.'],
    reflection: 'Which planning step saved the most production time?'
  },
  10: {
    efficiencySkill: 'Use AI to organize evidence and design a presentation structure before creating slides.',
    vocabulary: ['slide objective', 'evidence', 'speaker notes', 'visual hierarchy', 'chart', 'source note', 'rehearsal'],
    whenToUseAI: ['Turning verified notes into an outline.', 'Suggesting slide order, titles and speaker-note prompts.', 'Reducing text while preserving meaning.'],
    whenNotToUseAI: ['To invent data, quotes or statistics.', 'To create a slide deck you cannot explain yourself.'],
    method: [
      'Define what the audience should know/do at the end.',
      'Group verified evidence into 3–5 main ideas.',
      'Make one slide objective per slide.',
      'Choose visual evidence before decorative images.',
      'Use AI to shorten or reorganize, not to invent.',
      'Add source notes where needed.',
      'Rehearse and remove slides that do not earn their place.'
    ],
    workedExample: {
      task: 'Present a team environmental project.',
      weak: '“Make 10 slides about our project.”',
      stronger: '“Using only the verified notes below, propose a 6-slide outline for a 3-minute presentation. For each slide give: one-sentence purpose, title, one recommended visual and maximum three bullet points. Do not invent statistics. End with a clear call to action.”',
      whyBetter: ['Time, evidence and slide count are constrained.', 'Each slide gets a purpose.', 'The prompt blocks invented data.']
    },
    promptPattern: '“Turn these verified notes into a presentation outline. Audience: ___. Time: ___. Goal: ___. One idea per slide. For each slide return purpose, title, visual suggestion, max 3 bullets, and speaker-note prompt.”',
    commonMistakes: [
      { mistake: 'Starting in slide-design mode before knowing the story.', fix: 'Outline and evidence map first.' },
      { mistake: 'Copying paragraphs onto slides.', fix: 'Move detail to speaker notes and keep visual hierarchy.' },
      { mistake: 'Using a generated chart from unverified numbers.', fix: 'Build charts only from known data.' }
    ],
    guidedPractice: ['Create a six-slide outline from notes.', 'Remove one unnecessary slide.', 'Rewrite one crowded slide into one idea.', 'Practice a 60-second section and adjust.'],
    transferChallenge: 'Turn the same evidence into a 3-slide quick update and an 8-slide deeper presentation.',
    qualityCheck: ['Every slide supports the goal.', 'Evidence is verified.', 'Text is readable.', 'Sources are traceable.', 'Speaker can explain without reading.'],
    reflection: 'Which slide did you remove or simplify, and why did the presentation improve?'
  },
  11: {
    efficiencySkill: 'Repurpose one verified message into multiple content formats without losing accuracy or brand consistency.',
    vocabulary: ['audience', 'message', 'hook', 'call to action', 'variant', 'brand voice', 'repurpose', 'A/B test'],
    whenToUseAI: ['Generating multiple headline/caption variants.', 'Adapting one verified message for different formats and audiences.', 'Checking consistency across content pieces.'],
    whenNotToUseAI: ['To make false promises, fake testimonials or manipulative claims.', 'To mass-produce content without human review.'],
    method: [
      'Lock the verified core message first.',
      'Name the audience and desired action.',
      'Create variants for different formats.',
      'Keep factual claims identical unless re-verified.',
      'Compare variants against a simple rubric.',
      'Choose and edit rather than publishing everything.'
    ],
    workedExample: {
      task: 'Promote a student recycling event.',
      weak: '“Make viral posts for our recycling event.”',
      stronger: '“Using this verified event information, create: 3 poster headlines, 2 short captions and one 15-second announcement script. Audience: students ages 9–12. Keep date/time/location exactly as provided. Tone: energetic, not pushy. Call to action: bring one clean recyclable item.”',
      whyBetter: ['The factual core is protected.', 'Formats and audience are defined.', 'AI produces options rather than spam.']
    },
    promptPattern: '“Repurpose this approved message into [formats]. Keep these facts unchanged: ___. Audience: ___. Brand voice: ___. CTA: ___. Give me 3 variants, then score each for clarity, truthfulness and audience fit.”',
    commonMistakes: [
      { mistake: 'Changing facts while “making the copy more exciting.”', fix: 'Lock facts before creating variants.' },
      { mistake: 'Creating content for everyone.', fix: 'Choose a specific audience.' },
      { mistake: 'Publishing all generated variants.', fix: 'Select and edit the strongest one.' }
    ],
    guidedPractice: ['Write one approved core message.', 'Generate three hooks.', 'Score them.', 'Adapt the winner into three formats.', 'Check that the facts stayed unchanged.'],
    transferChallenge: 'Repurpose one project update into a poster, caption, email-style notice and short video script.',
    qualityCheck: ['Core facts remain accurate.', 'Audience is clear.', 'CTA is specific.', 'Tone is consistent.', 'No manipulative claims.'],
    reflection: 'Which content format required the biggest change in structure while keeping the same message?'
  },
  12: {
    efficiencySkill: 'Break complex work into reusable AI-assisted steps with clean handoffs and quality gates.',
    vocabulary: ['workflow', 'task decomposition', 'handoff', 'structured output', 'template', 'quality gate', 'dependency', 'reuse'],
    whenToUseAI: ['Repeated multi-step work where outputs can be checked between stages.', 'Converting one format into another.', 'Creating reusable templates/checklists.'],
    whenNotToUseAI: ['When a workflow would automate mistakes faster.', 'When nobody is responsible for checking handoffs.'],
    method: [
      'Define the final output.',
      'Break it into independent or dependent steps.',
      'Choose human, AI or simple-tool owner for each step.',
      'Specify the input and output format for each handoff.',
      'Add a quality gate after risky steps.',
      'Save successful prompts/templates.',
      'Measure whether the workflow actually saves time.'
    ],
    workedExample: {
      task: 'Create a researched educational video.',
      weak: '“AI, make our whole video.”',
      stronger: 'Workflow: research questions → human-verified notes → AI outline → human approval → AI storyboard → asset creation → human fact/ethics check → edit → captions → final review.',
      whyBetter: ['Each stage has an owner.', 'Errors can be caught before spreading.', 'Verified research is separated from creative generation.', 'Reusable handoffs reduce repeated prompting.']
    },
    promptPattern: '“Design a workflow for ___. For each step return: goal, input, owner (human/AI/simple tool), output format, quality check, and dependency. Mark any step where an error could spread.”',
    commonMistakes: [
      { mistake: 'Automating before understanding the process.', fix: 'Run the workflow manually once and inspect weak points.' },
      { mistake: 'Passing messy output from one step into the next.', fix: 'Use structured handoff formats.' },
      { mistake: 'Re-prompting from scratch every time.', fix: 'Save templates and examples that worked.' }
    ],
    guidedPractice: ['Map a five-step workflow.', 'Assign owners.', 'Define one structured output such as a table.', 'Add two quality gates.', 'Run a small test and identify the bottleneck.'],
    transferChallenge: 'Turn one weekly school task into a reusable workflow and compare time/quality before and after.',
    qualityCheck: ['Steps are clear.', 'Inputs/outputs match.', 'Quality gates exist.', 'Human responsibility is visible.', 'Reuse actually saves effort.'],
    reflection: 'Which step should never be automated without a human check, and why?'
  },
  13: {
    efficiencySkill: 'Use AI to widen solution options, then use evidence and human criteria to choose and test.',
    vocabulary: ['problem statement', 'constraint', 'root cause', 'option', 'criteria', 'prototype', 'feedback', 'decision matrix'],
    whenToUseAI: ['Generating alternative approaches.', 'Reframing a problem.', 'Creating test questions and organizing feedback.'],
    whenNotToUseAI: ['To decide what people need without talking to them.', 'To make high-impact decisions without responsible adults/experts.'],
    method: [
      'Describe the problem without naming a solution.',
      'List who is affected and important constraints.',
      'Ask AI for multiple different approaches.',
      'Create human decision criteria.',
      'Score options against the criteria.',
      'Prototype the smallest useful version.',
      'Collect feedback and revise.'
    ],
    workedExample: {
      task: 'Students keep forgetting reusable water bottles.',
      weak: '“Make an app to solve this.”',
      stronger: '“Problem: students often forget reusable bottles. Constraints: no personal tracking, low cost, easy for teachers. Generate six solution approaches across reminders, environment, routines and incentives. Do not assume an app is needed.”',
      whyBetter: ['The problem is separated from a preferred solution.', 'Privacy and cost constraints guide ideas.', 'AI is used to widen options.']
    },
    promptPattern: '“Generate 6 meaningfully different ways to address this problem: ___. Users: ___. Constraints: ___. For each option list benefit, risk, effort and what we would need to test.”',
    commonMistakes: [
      { mistake: 'Falling in love with the first AI idea.', fix: 'Require multiple approaches before choosing.' },
      { mistake: 'Letting AI invent what users want.', fix: 'Use real feedback where appropriate.' },
      { mistake: 'Choosing the flashiest option instead of the best fit.', fix: 'Use explicit criteria.' }
    ],
    guidedPractice: ['Write a problem statement.', 'Generate six options.', 'Define three criteria.', 'Score the options.', 'Prototype the top choice.', 'Collect one piece of feedback.'],
    transferChallenge: 'Solve the same problem under a new constraint such as half the time, no budget or no Internet.',
    qualityCheck: ['Problem is clear.', 'Multiple options were considered.', 'Decision criteria are human-chosen.', 'Prototype tests a real uncertainty.', 'Feedback changes the plan when appropriate.'],
    reflection: 'Which option looked exciting at first but scored poorly against your criteria?'
  },
  14: {
    efficiencySkill: 'Use AI as a business-thinking assistant while keeping customer evidence, numbers and promises grounded.',
    vocabulary: ['customer', 'problem', 'offer', 'value', 'cost', 'price', 'brand promise', 'assumption', 'validation'],
    whenToUseAI: ['Brainstorming offers, names, FAQs and customer questions.', 'Organizing interview notes.', 'Creating draft descriptions from verified product information.'],
    whenNotToUseAI: ['To invent customer demand, fake reviews or financial results.', 'To set prices or make promises without human/guardian oversight.'],
    method: [
      'Name the audience/customer.',
      'Describe the problem using evidence, not guesses.',
      'Define the simplest useful offer.',
      'List assumptions that still need testing.',
      'Estimate basic time/material cost with adult help.',
      'Use AI to generate communication options.',
      'Check every claim before sharing.'
    ],
    workedExample: {
      task: 'Design a supervised mini service that creates event posters.',
      weak: '“Make a profitable AI business for me.”',
      stronger: '“Help me plan a supervised poster-design service for school clubs. First list the customer problem, what information I need from a club, a simple service package, five questions to validate demand, and risks. Do not invent prices or customer quotes.”',
      whyBetter: ['AI structures the thinking without pretending demand exists.', 'Unknowns are turned into questions.', 'Financial claims stay human-reviewed.']
    },
    promptPattern: '“Act as a planning assistant. My audience is ___. The problem evidence I have is ___. Help me create a simple offer, list assumptions, write customer questions, and flag any claim I still need to verify.”',
    commonMistakes: [
      { mistake: 'Treating AI-generated market ideas as market research.', fix: 'Validate with real people or trusted sources.' },
      { mistake: 'Creating fake reviews/testimonials.', fix: 'Use real feedback only.' },
      { mistake: 'Overpromising what the service can do.', fix: 'Write a clear scope and realistic limitations.' }
    ],
    guidedPractice: ['Write customer/problem/offer.', 'List five assumptions.', 'Turn assumptions into questions.', 'Draft three brand-name options.', 'Write a truthful description.', 'Have an adult/instructor review any money-related claims.'],
    transferChallenge: 'Change the audience and see which parts of the offer must change versus which can stay reusable.',
    qualityCheck: ['Problem is evidence-based.', 'Offer is understandable.', 'Assumptions are visible.', 'Claims are truthful.', 'Money/real sales stay supervised.'],
    reflection: 'Which assumption did AI help you notice that you still need to test in the real world?'
  },
  15: {
    efficiencySkill: 'Run a final AI quality-assurance pass using explicit criteria instead of asking “Is this good?”',
    vocabulary: ['quality assurance', 'rubric', 'acceptance criteria', 'provenance', 'accessibility', 'consistency', 'release check'],
    whenToUseAI: ['Checking a draft against a rubric.', 'Spotting inconsistencies, missing sections or unclear wording.', 'Generating a checklist from requirements.'],
    whenNotToUseAI: ['As the only final approver.', 'To certify facts it cannot independently prove.', 'To hide known defects.'],
    method: [
      'Freeze the requirements.',
      'Turn requirements into a checklist.',
      'Ask AI to inspect the artifact against the checklist.',
      'Verify every factual flag manually.',
      'Check accessibility, permissions and attribution.',
      'Fix the highest-impact problems first.',
      'Run a final human review from the audience perspective.'
    ],
    workedExample: {
      task: 'Review the final team campaign.',
      weak: '“Is our project good?”',
      stronger: '“Review the project text below against this checklist: audience clarity, factual claims supported by our research notes, no private data, clear call to action, reading level for ages 9–12, and consistent terminology. Return a table: criterion, pass/needs work, evidence, suggested fix. Do not verify facts beyond the notes I provide.”',
      whyBetter: ['Quality is measurable.', 'The AI knows its evidence boundary.', 'The output is actionable.']
    },
    promptPattern: '“Audit this artifact against these acceptance criteria: ___. Return criterion | pass/needs work | evidence | suggested fix. Do not add new facts. Flag anything you cannot verify.”',
    commonMistakes: [
      { mistake: 'Asking AI for a vague opinion.', fix: 'Give a rubric or acceptance criteria.' },
      { mistake: 'Treating AI’s “looks correct” as verification.', fix: 'Check sources and real behavior yourself.' },
      { mistake: 'Fixing tiny cosmetic issues before major factual problems.', fix: 'Prioritize by impact.' }
    ],
    guidedPractice: ['Build a release checklist.', 'Run an AI audit.', 'Verify two flags manually.', 'Fix highest-impact issues.', 'Run accessibility/permission checks.', 'Complete a human final review.'],
    transferChallenge: 'Create a reusable quality checklist for future AI-assisted school work.',
    qualityCheck: ['Requirements are explicit.', 'Facts verified externally.', 'Privacy/permission checked.', 'Accessibility considered.', 'Known issues are disclosed or fixed.'],
    reflection: 'What did the structured audit catch that a simple “Is this good?” question would have missed?'
  },
  16: {
    efficiencySkill: 'Build a personal AI playbook that captures reusable prompts, workflows, verification habits and limits.',
    vocabulary: ['portfolio', 'playbook', 'prompt template', 'workflow', 'evidence', 'reflection', 'transfer', 'responsible use'],
    whenToUseAI: ['When a saved template or workflow clearly helps a future task.', 'To review your own process and suggest where you can become more efficient.'],
    whenNotToUseAI: ['When blindly reusing an old prompt would ignore a new audience or context.', 'When the final explanation should demonstrate your own understanding.'],
    method: [
      'Choose strong examples from across the course.',
      'Show before/after prompts or outputs.',
      'Record what AI did and what the human did.',
      'Save 5–10 reusable prompt patterns.',
      'Save at least two workflows.',
      'Write your personal verification and privacy rules.',
      'Explain one situation where you intentionally would not use AI.',
      'Set one next skill goal.'
    ],
    workedExample: {
      task: 'Show efficient AI use in a final portfolio.',
      weak: 'A folder containing only polished final AI outputs.',
      stronger: 'A portfolio showing the original goal, prompt iterations, sources/evidence, human edits, workflow diagram, final product, mistakes caught, and reusable prompt templates.',
      whyBetter: ['It proves skill rather than tool access.', 'It shows judgment, verification and improvement.', 'The learner leaves with reusable methods.']
    },
    promptPattern: '“Review my AI learning evidence below. Help me identify: 3 prompt patterns worth saving, 2 workflows I can reuse, 2 mistakes I now know how to avoid, and 1 situation where I should choose a non-AI tool. Ask me questions instead of inventing missing evidence.”',
    commonMistakes: [
      { mistake: 'Showing only final outputs.', fix: 'Include process evidence and decisions.' },
      { mistake: 'Saving prompts without explaining when to use them.', fix: 'Add purpose, inputs and quality checks to each template.' },
      { mistake: 'Claiming mastery because an AI produced something impressive.', fix: 'Demonstrate understanding by explaining choices and checking results.' }
    ],
    guidedPractice: ['Select portfolio evidence.', 'Create five reusable prompt templates.', 'Document two workflows.', 'Write personal privacy/verification rules.', 'Present one before/after improvement story.'],
    transferChallenge: 'Use your playbook on a completely new task and note what transferred well and what had to change.',
    qualityCheck: ['Portfolio shows process.', 'Templates are reusable.', 'Verification rules are concrete.', 'Human contribution is clear.', 'Learner can explain when not to use AI.'],
    reflection: 'What is the one AI habit you expect to use most often after this course?'
  }
};
