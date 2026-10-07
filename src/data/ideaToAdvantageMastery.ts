export type BusinessOperatorMastery = {
  keyDecision: string;
  mentalModel: string[];
  operatorMoves: string[];
  workedExample: string;
  buildSystem: string[];
  controlLoop: string[];
  redTeamQuestions: string[];
  masteryEvidence: string[];
  transferChallenge: string;
  thirtyDayProof: string;
};

export const IDEA_TO_ADVANTAGE_MASTERY: Record<number, BusinessOperatorMastery> = {
  1: {
    keyDecision: 'What must change for this business to become an evidence-driven system rather than a collection of owner effort and good intentions?',
    mentalModel: [
      'An idea becomes an advantage only when customers value it, the business can deliver it repeatedly, and the economics leave enough cash and margin to continue.',
      'Owner activity is not the same as business progress. Progress should create evidence, a repeatable process, an asset, a stronger customer relationship or a measurable financial result.',
      'A baseline is useful only if it leads to priorities; a long weakness list with no ranked action is not management.'
    ],
    operatorMoves: [
      'Separate assumptions from evidence.',
      'Name the customer result the business exists to create.',
      'Identify the current constraint that most limits progress.',
      'Choose one measurable 30-day improvement instead of trying to repair everything at once.'
    ],
    workedExample: 'A small catering business says “we need more sales.” Its records show enquiries are healthy but 45% of quotes receive no follow-up. The stronger first move is not more advertising; it is a quote-follow-up system with an owner, timing rule and conversion measure.',
    buildSystem: [
      'Create a one-page business operating picture: customer, offer, money flow, delivery flow and key dependencies.',
      'Rank weaknesses by impact on cash, customer value, continuity and owner time.',
      'Set one 30-day improvement with baseline, target, owner and review date.'
    ],
    controlLoop: [
      'Review the Business Advantage Score monthly or quarterly—not as a one-time personality test.',
      'Compare planned action with evidence of actual use.',
      'If the chosen constraint is no longer the bottleneck, deliberately select the next constraint.'
    ],
    redTeamQuestions: [
      'What evidence shows this is really the most important problem?',
      'Are you treating being busy as proof of progress?',
      'What would still fail if sales doubled next month?'
    ],
    masteryEvidence: [
      'Can distinguish idea, activity and durable advantage.',
      'Can identify a constraint using evidence.',
      'Can state one measurable 30-day action and its owner.'
    ],
    transferChallenge: 'Given a business with strong sales but repeated late delivery and refund complaints, decide whether marketing, operations or finance should receive the next management priority and justify it from evidence.',
    thirtyDayProof: 'At the next review, show the original baseline, the action taken, the measure that changed and the next decision.'
  },
  2: {
    keyDecision: 'Which customer problem and market segment are strong enough to deserve scarce time and cash?',
    mentalModel: [
      'Market size is less useful than reachable demand: people who have the problem, can be reached, trust the offer and can pay.',
      'Compliments and survey interest are weak evidence. Past behaviour, deposits, pre-orders, paid pilots, repeat use and switching behaviour are stronger.',
      'Caribbean markets may be small locally but segmented by resident, business, tourism, diaspora and regional demand; each pathway has different costs and trust requirements.'
    ],
    operatorMoves: [
      'Define one priority customer and one job/problem in concrete language.',
      'Collect evidence about recent behaviour before pitching the solution.',
      'Test the riskiest assumption with the cheapest credible experiment.',
      'Set a go/change/stop rule before seeing the results.'
    ],
    workedExample: 'Before importing 30 premium beach products, an entrepreneur interviews target hotel operators, demonstrates one sample and asks for a refundable deposit. Three deposits from the target buyer segment are stronger evidence than 20 social-media likes.',
    buildSystem: [
      'Create a market evidence table: customer segment, problem, current alternative, evidence, objection and willingness-to-act signal.',
      'Compare at least three market pathways by reachable demand, acquisition cost, fulfilment difficulty and payment risk.',
      'Design the next experiment around the highest-risk assumption.'
    ],
    controlLoop: [
      'Track tests by hypothesis, result and next decision.',
      'Record who declined and why—not only positive feedback.',
      'Stop or redesign when evidence repeatedly misses the pre-set threshold.'
    ],
    redTeamQuestions: [
      'Are you asking leading questions that invite politeness?',
      'Does your “target market” include people with very different problems?',
      'Would the customer still buy if the discount disappeared?'
    ],
    masteryEvidence: [
      'Can define a narrow priority segment and job-to-be-done.',
      'Can rank evidence by strength.',
      'Can design a low-cost test with a decision rule.'
    ],
    transferChallenge: 'A tourism-focused business sees strong high-season demand and weak off-season sales. Decide whether to broaden the customer segment, change the offer or accept seasonality—and identify the evidence needed before choosing.',
    thirtyDayProof: 'Run one real demand test and document the decision produced by the result, including negative evidence.'
  },
  3: {
    keyDecision: 'Does each sale create enough contribution to cover fixed costs, capacity constraints, risk and growth needs?',
    mentalModel: [
      'Revenue is not profit, markup is not margin, and profit is not cash.',
      'Contribution per sale determines how much each unit/job/booking contributes toward fixed costs and profit.',
      'Pricing should reflect customer value and market reality while remaining compatible with cost, capacity and risk.',
      'A business can appear profitable on paper while failing because the required sales volume exceeds realistic capacity.'
    ],
    operatorMoves: [
      'Separate variable/direct costs from fixed costs.',
      'Calculate contribution per sale before break-even.',
      'Test at least three scenarios for price, volume and cost shocks.',
      'Compare break-even volume with real operational capacity.'
    ],
    workedExample: 'A service sells for EC$250 and has EC$70 direct labour/material cost, so contribution is EC$180. With EC$5,400 monthly fixed costs, simple break-even is 30 jobs. If capacity is only 24 jobs, the current model cannot break even without price, cost or capacity changes.',
    buildSystem: [
      'Build a unit-economics table for the main offer.',
      'Create a break-even model linked to realistic monthly capacity.',
      'Add sensitivity scenarios for supplier cost increases, discounting and lower demand.'
    ],
    controlLoop: [
      'Review contribution and realised selling price, not just revenue.',
      'Recalculate when direct costs, exchange rates or capacity materially change.',
      'Investigate products/services that consume capacity but contribute too little.'
    ],
    redTeamQuestions: [
      'Have you included owner labour and payment/transaction costs where relevant?',
      'Are discounts destroying contribution?',
      'Can the business physically deliver the break-even volume?'
    ],
    masteryEvidence: [
      'Can calculate contribution, margin and break-even correctly.',
      'Can distinguish markup from margin.',
      'Can identify when capacity makes a financial model unrealistic.'
    ],
    transferChallenge: 'A product has attractive percentage margin but ties up cash for four months and sells slowly. Explain why margin alone is not enough to decide whether to keep it.',
    thirtyDayProof: 'Use the model in one real pricing, discount, product-mix or capacity decision and record the before/after economics.'
  },
  4: {
    keyDecision: 'Can the owner see cash early enough to act before shortages become emergencies?',
    mentalModel: [
      'Profit measures economic performance; cash determines whether obligations can be paid when due.',
      'A cash forecast is a decision tool, not an accounting decoration.',
      'Reconciliation is how the owner knows records match reality.',
      'A useful finance rhythm separates daily recording, weekly cash control and monthly management review.'
    ],
    operatorMoves: [
      'Forecast timing of receipts and payments rather than using sales invoices as cash.',
      'Reconcile bank, cash, card and payment-platform balances.',
      'Identify the lowest-cash point before committing to new spending.',
      'Use a short KPI set tied to decisions.'
    ],
    workedExample: 'A business makes a profitable EC$20,000 sale but gives 60-day credit while paying the supplier immediately. The income statement can look strong while cash falls sharply. The forecast reveals the funding gap before the order is accepted.',
    buildSystem: [
      'Create a rolling 12-month cash forecast with expected, conservative and stronger-sales assumptions.',
      'Define who records transactions, who reconciles and who reviews.',
      'Create an exception list for overdue receivables, upcoming obligations and unusual variances.'
    ],
    controlLoop: [
      'Update near-term cash weekly.',
      'Reconcile balances on a defined schedule.',
      'Review forecast-versus-actual and explain major differences.'
    ],
    redTeamQuestions: [
      'Are receivables being treated as if they were already cash?',
      'Are personal and business transactions mixed?',
      'Does the forecast include taxes, debt payments, maintenance and seasonal costs?'
    ],
    masteryEvidence: [
      'Can explain profit-versus-cash with a real example.',
      'Can build and interpret a cash forecast.',
      'Can define a finance control rhythm and escalation trigger.'
    ],
    transferChallenge: 'Sales are growing 25%, but cash is shrinking. Build a short list of evidence you would inspect before deciding whether growth is healthy.',
    thirtyDayProof: 'Run four weekly cash reviews and show one decision that changed because of the forecast or reconciliation.'
  },
  5: {
    keyDecision: 'How much inventory, equipment or critical capacity should the business hold without trapping unnecessary cash?',
    mentalModel: [
      'Availability has a cost, but excess stock and idle assets also have a cost.',
      'Landed cost includes all attributable costs required to make an item available—not only supplier price.',
      'Reorder logic should reflect demand during lead time plus uncertainty/safety allowance.',
      'Service businesses manage capacity, tools and critical inputs using the same control logic as inventory.'
    ],
    operatorMoves: [
      'Calculate landed or ownership cost before comparing suppliers.',
      'Measure demand/usage and lead time.',
      'Define reorder/capacity triggers and a count/maintenance rhythm.',
      'Track supplier performance beyond unit price.'
    ],
    workedExample: 'A “cheap” imported item costs US$20 from the supplier but adds freight, duty, brokerage and local transport. If landed cost becomes EC$78 instead of the assumed EC$54, the old selling price may destroy the intended margin.',
    buildSystem: [
      'Create an item/resource master with cost, lead time, supplier and control owner.',
      'Define reorder point or replacement/capacity trigger for one critical input.',
      'Create a supplier scorecard including reliability, quality, total cost and recovery options.'
    ],
    controlLoop: [
      'Review stock-outs, excess/dead stock, idle assets and supplier failures.',
      'Investigate count variances instead of simply adjusting the record.',
      'Recalculate triggers when demand or lead time changes materially.'
    ],
    redTeamQuestions: [
      'Are you buying extra stock because it feels safer rather than because the numbers support it?',
      'What happens if the main supplier fails for 30 days?',
      'Which “asset” is consuming cash but rarely used?'
    ],
    masteryEvidence: [
      'Can calculate a realistic landed/ownership cost.',
      'Can create a basic reorder/capacity trigger.',
      'Can compare suppliers using more than purchase price.'
    ],
    transferChallenge: 'A supplier offers a 15% bulk discount but requires buying six months of stock. Decide what cash, demand and obsolescence evidence is needed before accepting.',
    thirtyDayProof: 'Apply one new reorder, supplier or asset-control rule and measure stock-out, idle-capacity or cash impact.'
  },
  6: {
    keyDecision: 'Can the business deliver its promise repeatedly without the owner personally rescuing every order?',
    mentalModel: [
      'A workflow is a chain of handoffs from demand to delivery, payment and follow-up.',
      'An SOP should make the critical standard visible while still allowing judgment where judgment is needed.',
      'Quality control should be designed into the process, not left until the customer complains.',
      'Capacity is the maximum sustainable throughput at the required quality—not the theoretical maximum if everyone overworks.'
    ],
    operatorMoves: [
      'Map the current process before redesigning it.',
      'Identify wait time, rework, unclear ownership and failure points.',
      'Define standard work, exception rules and quality checks.',
      'Measure throughput, backlog, turnaround and on-time delivery.'
    ],
    workedExample: 'A repair business loses two days because completed jobs wait for the owner to approve invoices. Giving a trained supervisor a defined approval limit removes a bottleneck without removing financial control.',
    buildSystem: [
      'Create one order/booking-to-cash process map.',
      'Write an SOP for the most failure-prone recurring step.',
      'Define an exception path for complaints, refunds, quality failures or missing information.'
    ],
    controlLoop: [
      'Review one operating dashboard on a fixed rhythm.',
      'Investigate repeat rework and bottlenecks.',
      'Update SOPs after real failures reveal a missing control.'
    ],
    redTeamQuestions: [
      'Where does work wait for the owner unnecessarily?',
      'Which step has no definition of “done”?',
      'If volume doubled, where would the process fail first?'
    ],
    masteryEvidence: [
      'Can map a core workflow end-to-end.',
      'Can write an SOP with owner, trigger, steps, quality criteria and exception path.',
      'Can define an operational KPI with target and escalation rule.'
    ],
    transferChallenge: 'A business is “busy” but turnaround time is getting worse. Decide which workflow/capacity evidence would distinguish demand growth from process failure.',
    thirtyDayProof: 'Use the SOP/KPI system for four weeks and document one process improvement based on measured evidence.'
  },
  7: {
    keyDecision: 'Which message and channel combination produces profitable customer action rather than vanity metrics?',
    mentalModel: [
      'Marketing should move a defined audience toward a measurable action.',
      'Positioning explains who the offer is for, what problem it solves and why the customer should believe it.',
      'Owned contact channels reduce dependence on one social platform.',
      'Marketing economics should connect spend/effort to qualified leads, conversion, revenue and contribution.'
    ],
    operatorMoves: [
      'Define audience, problem, offer and call to action before choosing content format.',
      'Choose channels by customer journey stage and actual buyer behaviour.',
      'Track source and conversion.',
      'Compare marketing cost with contribution, not likes.'
    ],
    workedExample: 'A campaign generates 5,000 views and 12 enquiries, of which 3 buy. A smaller WhatsApp referral campaign generates 20 enquiries and 8 buyers. Reach alone would favour the wrong channel; conversion and contribution change the decision.',
    buildSystem: [
      'Create a positioning statement and proof points.',
      'Map channels to awareness, consideration, conversion and retention.',
      'Build a 90-day campaign calendar with owner, budget, CTA and measure.'
    ],
    controlLoop: [
      'Review qualified leads and conversion by source.',
      'Stop or redesign channels that consume effort without economic return.',
      'Capture permission-based customer contact information where appropriate.'
    ],
    redTeamQuestions: [
      'Are you measuring attention instead of customer action?',
      'Would the message still be credible without hype?',
      'Are you overdependent on one platform you do not control?'
    ],
    masteryEvidence: [
      'Can write a specific positioning statement.',
      'Can select channels based on customer behaviour.',
      'Can calculate and interpret basic marketing economics.'
    ],
    transferChallenge: 'A business has strong Instagram engagement but few purchases. Build a test that distinguishes weak targeting, weak offer, weak trust and weak follow-up.',
    thirtyDayProof: 'Run one measured campaign and document the funnel from reach/contacts to qualified leads, conversions and contribution.'
  },
  8: {
    keyDecision: 'Where can AI or automation produce measurable business value without creating unacceptable data, quality or control risk?',
    mentalModel: [
      'AI is a capability, not a strategy. Start from a business problem, baseline and desired improvement.',
      'The real cost of a tool includes setup, training, review, errors, integration and vendor dependence.',
      'Low-risk, repetitive, reviewable work is usually a better pilot target than high-stakes autonomous decisions.',
      'Human accountability remains even when AI generates or automates part of the work.'
    ],
    operatorMoves: [
      'Quantify the business problem before evaluating tools.',
      'Classify data sensitivity and the consequence of a wrong output.',
      'Compare tool categories against fit, integration, cost and control.',
      'Pilot with baseline, target, owner, human review and stop rule.'
    ],
    workedExample: 'A business spends 10 staff-hours per week turning call notes into CRM summaries. An AI pilot may be worthwhile if it reduces time while maintaining accuracy and privacy. It is less suitable to autonomously approve refunds or financial commitments without controls.',
    buildSystem: [
      'Create an AI opportunity register ranked by value, risk and ease of review.',
      'Build a tool decision matrix including privacy, integration and total cost.',
      'Design one 30-day bounded pilot.'
    ],
    controlLoop: [
      'Compare before/after time, quality and error rates.',
      'Review exceptions and human overrides.',
      'Stop the pilot if quality, privacy or cost thresholds are missed.'
    ],
    redTeamQuestions: [
      'Is this automation solving a real bottleneck or just adding technology?',
      'What happens when the AI is confidently wrong?',
      'What customer/confidential data would enter the tool?'
    ],
    masteryEvidence: [
      'Can identify a suitable low-risk AI opportunity.',
      'Can compare tools on more than feature lists.',
      'Can design measurable human-reviewed pilot controls.'
    ],
    transferChallenge: 'A vendor promises an AI assistant will “replace admin work.” Decide what baseline, data-risk and quality evidence you need before buying.',
    thirtyDayProof: 'Run one bounded pilot and produce a keep/change/stop decision based on measured results.'
  },
  9: {
    keyDecision: 'How will every serious lead and customer receive consistent follow-up, service and retention attention?',
    mentalModel: [
      'A CRM is a management system for customer commitments and next actions, not merely a contact list.',
      'Pipeline stages should represent observable buyer progress.',
      'Retention economics matter because repeat customers often cost less to serve/acquire than constantly replacing churn.',
      'Service recovery can strengthen trust when the business responds quickly, fairly and learns from the failure.'
    ],
    operatorMoves: [
      'Define pipeline stages with entry/exit rules.',
      'Assign every serious opportunity a next action and owner.',
      'Build post-purchase follow-up around customer value rather than spam.',
      'Record complaint/root-cause patterns.'
    ],
    workedExample: 'If 40 enquiries enter WhatsApp but only 15 are captured in a CRM, the business cannot reliably follow up or measure conversion. The first fix is lead capture discipline, not more advertising.',
    buildSystem: [
      'Create pipeline stages and mandatory fields.',
      'Define response/follow-up timing and owner.',
      'Design a 90-day post-purchase journey including service, repeat and referral moments.'
    ],
    controlLoop: [
      'Review ageing opportunities and missed follow-ups.',
      'Measure conversion by stage and lost-sale reason.',
      'Track repeat purchase, retention, referrals and complaint recovery.'
    ],
    redTeamQuestions: [
      'Do pipeline stages describe real customer behaviour or internal wishful thinking?',
      'Are leads disappearing inside personal phones/chats?',
      'Are follow-ups useful or just repetitive promotional messages?'
    ],
    masteryEvidence: [
      'Can design a measurable sales pipeline.',
      'Can define minimum CRM data and follow-up rules.',
      'Can create a retention/service-recovery experiment.'
    ],
    transferChallenge: 'A business has many enquiries but poor conversion and no clear lost-sale data. Build the smallest CRM discipline that would make the problem measurable within 30 days.',
    thirtyDayProof: 'Run weekly pipeline reviews and show one conversion, follow-up or retention decision driven by the CRM evidence.'
  },
  10: {
    keyDecision: 'Which work should the owner retain, delegate, outsource or automate so the business can grow without losing accountability?',
    mentalModel: [
      'Delegation transfers responsibility for an outcome with authority and boundaries; it is not dumping tasks.',
      'Roles should be defined by outputs and decisions, not vague job titles.',
      'The owner should retain work where judgment, legal accountability, sensitive relationships or strategic tradeoffs genuinely require it.',
      'Check-ins should surface exceptions and coaching needs, not recreate micromanagement.'
    ],
    operatorMoves: [
      'List recurring owner work and classify retain/delegate/outsource/automate.',
      'Define outcome, standard, authority, resources and escalation rule.',
      'Create role scorecards with a small number of observable results.',
      'Review performance on a predictable rhythm.'
    ],
    workedExample: 'An owner approves every EC$50 supply purchase, delaying work. A delegation rule allowing a supervisor to approve budgeted purchases under EC$300 with weekly review increases speed while preserving financial control.',
    buildSystem: [
      'Create an outcome-based responsibility chart.',
      'Design one delegation agreement with authority limits.',
      'Create one role scorecard and check-in agenda.'
    ],
    controlLoop: [
      'Review outcomes and exceptions rather than every action.',
      'Adjust authority when evidence shows too much or too little control.',
      'Coach recurring skill gaps instead of permanently taking the work back.'
    ],
    redTeamQuestions: [
      'Are you delegating responsibility without giving authority?',
      'Is the owner the bottleneck because controls are unclear?',
      'Does automation remove work or simply hide accountability?'
    ],
    masteryEvidence: [
      'Can distinguish delegation, outsourcing and automation.',
      'Can define a role by outputs and decision rights.',
      'Can build an accountability rhythm without micromanagement.'
    ],
    transferChallenge: 'The owner works 70 hours per week and still approves every customer quote, purchase and complaint. Rank which decisions should be redesigned first and why.',
    thirtyDayProof: 'Transfer one recurring responsibility using a written outcome/authority standard and review the result after four weeks.'
  },
  11: {
    keyDecision: 'What must continue, recover first or fail safely when severe weather, outages, cyber incidents or supplier disruption occur?',
    mentalModel: [
      'Resilience starts by identifying critical services and recovery priorities—not by buying random backup equipment.',
      'Dependencies include people, power, Internet, data, suppliers, facilities, cash and communication.',
      'Backups matter only if restoration is possible and tested.',
      'A continuity plan must work when normal staff, systems or communication are unavailable.'
    ],
    operatorMoves: [
      'Identify critical products/services and maximum tolerable downtime.',
      'Map dependencies and single points of failure.',
      'Set recovery priorities and alternative procedures.',
      'Run tabletop tests and record gaps.'
    ],
    workedExample: 'A booking business can survive an Internet outage if it has offline customer/contact exports, an alternate connection and a manual booking process. A cloud backup alone does not solve connectivity or access issues during the outage.',
    buildSystem: [
      'Create a business-impact table with service, dependency, downtime tolerance and recovery owner.',
      'Define power, connectivity, data, supplier and people contingencies.',
      'Create a cyber response checklist for compromised accounts/devices.'
    ],
    controlLoop: [
      'Test backups and recovery procedures.',
      'Run at least one tabletop scenario.',
      'Update contact lists, supplier alternatives and emergency roles.'
    ],
    redTeamQuestions: [
      'What if the owner is unavailable during the incident?',
      'What if the backup exists but credentials or Internet access do not?',
      'Which supplier or platform is a hidden single point of failure?'
    ],
    masteryEvidence: [
      'Can identify critical operations and recovery priorities.',
      'Can map major dependencies and single points of failure.',
      'Can design and test a practical continuity response.'
    ],
    transferChallenge: 'A storm causes a 48-hour power/internet outage during peak season. Decide which services to preserve first, which to pause, and how customers/staff should be informed.',
    thirtyDayProof: 'Run one tabletop or restoration test and close at least one gap discovered by the exercise.'
  },
  12: {
    keyDecision: 'Which growth path deserves capital and management attention, and what evidence will determine whether the business should continue, change or stop?',
    mentalModel: [
      'Growth amplifies the existing system. Weak cash, operations or customer economics usually become bigger problems at scale.',
      'A growth case should connect opportunity, capability, capital, risk and measurable milestones.',
      'Local expansion, digital sales, diaspora/regional markets and new locations have different acquisition, logistics, compliance and working-capital requirements.',
      'A roadmap is useful only when priorities have owners, budgets, dependencies and review dates.'
    ],
    operatorMoves: [
      'Re-run the Business Advantage Diagnostic and compare evidence with the baseline.',
      'Rank growth options by strategic fit, economics, execution capability and downside risk.',
      'Build quarterly milestones and leading indicators.',
      'Define stop/change rules before committing the full investment.'
    ],
    workedExample: 'A retailer considering a second location may show strong revenue but weak inventory controls and unpredictable cash. The correct growth decision may be to strengthen the operating system first rather than duplicate the weaknesses in another site.',
    buildSystem: [
      'Build the 12-month Business Advantage Roadmap around three priorities.',
      'Assign owners, budgets, dependencies and milestone dates.',
      'Create an 8–12 KPI management dashboard linked to decisions.'
    ],
    controlLoop: [
      'Review progress monthly and strategy quarterly.',
      'Compare actual results with growth assumptions.',
      'Stop, sequence or redesign initiatives that consume capital without meeting evidence gates.'
    ],
    redTeamQuestions: [
      'Are you trying to grow away from an unresolved operating problem?',
      'What new working-capital need appears if sales double?',
      'Which assumption would make this growth plan fail fastest?'
    ],
    masteryEvidence: [
      'Can build an evidence-based growth case.',
      'Can prioritize a 12-month roadmap with owners and measures.',
      'Can explain a stop/change rule and downside scenario.',
      'Can integrate finance, market, operations, people, technology and resilience into one decision.'
    ],
    transferChallenge: 'Complete the Business Operator Benchmark: receive a new growth/shock scenario, diagnose the business, choose priorities, quantify the decision and defend the 90-day response using evidence.',
    thirtyDayProof: 'Schedule the first roadmap review and complete the first milestone with evidence, owner accountability and a documented decision.'
  }
};
