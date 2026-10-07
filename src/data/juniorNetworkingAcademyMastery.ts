export type NetworkMasteryLayer = {
  mentalModel: string[];
  technicianMoves: string[];
  workedExample: string;
  fieldDrills: string[];
  failureModes: string[];
  masteryEvidence: string[];
  transferChallenge: string;
  efficiencyMetric: string;
  applicationQuestions: Array<{
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }>;
};

export const JUNIOR_NETWORKING_MASTERY: Record<number, NetworkMasteryLayer> = {
  1: {
    mentalModel: [
      'A network is a system of endpoints, links, intermediary devices and services—not just “the Internet.”',
      'When data moves, each device only needs enough information to move the traffic to its next useful destination.',
      'Performance problems can come from delay, limited capacity, errors or loss at different points in the path.'
    ],
    technicianMoves: [
      'Draw the end-to-end path before troubleshooting.',
      'Separate local-network ownership from ISP/remote-service ownership.',
      'Name the sender, destination, medium and intermediary devices.',
      'Measure symptoms instead of assuming “the Internet is slow.”'
    ],
    workedExample: 'A classroom laptop opens a website. The path may be laptop → Wi-Fi AP → access switch → router/firewall → ISP → remote network → web server. A failure at any stage can create a similar user symptom, so the path must be understood before changing settings.',
    fieldDrills: [
      'Trace three everyday network journeys: local printer, school file server and public website.',
      'For each journey, mark which devices are inside your control and which are outside it.',
      'Compare bandwidth, latency and packet loss as three different performance problems.'
    ],
    failureModes: [
      'Mistake: saying “the Wi-Fi is broken” without identifying the failed service. Fix: define exactly what works and what does not.',
      'Mistake: treating the Internet and the local LAN as the same thing. Fix: draw the boundary and default-gateway path.'
    ],
    masteryEvidence: [
      'Can draw a believable end-to-end packet path.',
      'Can distinguish LAN, WLAN, WAN and Internet roles.',
      'Can describe a performance symptom using latency, throughput or loss rather than vague language.'
    ],
    transferChallenge: 'A user can print to a local printer but cannot open websites. Use the network path to identify which parts are already proven working and what should be tested next.',
    efficiencyMetric: 'Troubleshooting starts with a bounded fault domain instead of random device changes.',
    applicationQuestions: [
      { question: 'A laptop can reach a local printer but no public websites. What does that prove first?', options: ['At least part of the local LAN is working', 'The ISP is definitely working', 'DNS is definitely correct'], correct: 'At least part of the local LAN is working', explanation: 'Successful local communication proves useful parts of the endpoint/local-link path before the Internet path is considered.' },
      { question: 'Which description is most useful to a technician?', options: ['The Internet is bad', 'Web pages take 8 seconds to begin loading while local file access is normal', 'Everything is weird'], correct: 'Web pages take 8 seconds to begin loading while local file access is normal', explanation: 'A specific symptom and scope give evidence for the next test.' }
    ]
  },
  2: {
    mentalModel: [
      'Network devices have different forwarding, security, access and service roles even when one consumer box combines several functions.',
      'Good design depends on choosing the right function, interface count, speed, power capability and manageability for the requirement.',
      'Hardware is selected to solve requirements—not because of brand, appearance or the largest specification.'
    ],
    technicianMoves: [
      'Name the required function before naming a device.',
      'Check port count, port speed, uplinks, PoE budget and management needs.',
      'Separate routing, switching, firewalling, Wi-Fi and server functions on diagrams.',
      'Leave realistic spare capacity for growth and replacement.'
    ],
    workedExample: 'A 24-seat lab with four PoE cameras and two access points may need a managed PoE switch with enough powered ports and power budget, while routing/firewalling can remain on a separate gateway device.',
    fieldDrills: [
      'Match ten hardware devices to their primary job and one limitation.',
      'Compare an unmanaged switch, managed switch and all-in-one router for a school lab.',
      'Calculate required switch ports for a room plus 20% spare capacity.'
    ],
    failureModes: [
      'Mistake: choosing a device from port count alone. Fix: also check speed, PoE, uplink and management requirements.',
      'Mistake: assuming a home router is one network function. Fix: identify its built-in router, switch, firewall, DHCP and wireless roles.'
    ],
    masteryEvidence: [
      'Can identify common network equipment by function.',
      'Can explain why a selected device fits a stated requirement.',
      'Can identify one capacity or compatibility risk in a hardware list.'
    ],
    transferChallenge: 'Choose hardware for a small clinic with 12 PCs, 6 phones, 4 cameras, guest Wi-Fi and one local server. Explain the role of every selected device.',
    efficiencyMetric: 'Hardware choices map directly to documented requirements, reducing overbuying and missing features.',
    applicationQuestions: [
      { question: 'A switch has 24 ports, but eight devices need PoE. What additional specification matters?', options: ['PoE support and power budget', 'The colour of the chassis', 'The number of DNS records'], correct: 'PoE support and power budget', explanation: 'Powered devices require both PoE-capable ports and enough total power budget.' },
      { question: 'Why separate device functions on a logical diagram even if one box performs several?', options: ['It makes traffic and failure roles easier to understand', 'It changes MAC addresses', 'It increases rack height'], correct: 'It makes traffic and failure roles easier to understand', explanation: 'Functional separation improves reasoning, troubleshooting and future design changes.' }
    ]
  },
  3: {
    mentalModel: [
      'A network room is part of system reliability: power, heat, physical security, organization and recovery all matter.',
      'Rack layout should support serviceability and safe cable/power paths, not just visual neatness.',
      'UPS runtime is temporary continuity, not a substitute for generators, surge protection or shutdown planning.'
    ],
    technicianMoves: [
      'Record rack U positions and device power sources.',
      'Separate and manage power and data paths.',
      'Check airflow direction, heat load and access clearance.',
      'Document what should stay powered and for how long during an outage.'
    ],
    workedExample: 'A core switch, firewall and ISP device may stay on UPS power long enough for a short outage or controlled shutdown, while noncritical displays or lab PCs may not belong on the same battery budget.',
    fieldDrills: [
      'Build a rack elevation from a list of equipment.',
      'Identify three physical single points of failure.',
      'Create a priority list for UPS-backed versus non-UPS loads.'
    ],
    failureModes: [
      'Mistake: filling every rack space with no service/airflow plan. Fix: plan access, cable management and cooling.',
      'Mistake: sizing a UPS only by number of outlets. Fix: consider load, runtime and criticality.'
    ],
    masteryEvidence: [
      'Can produce a readable rack elevation.',
      'Can explain the role of UPS, PDU and cable management.',
      'Can identify physical/power risks and propose a response.'
    ],
    transferChallenge: 'A network room has one UPS powering a firewall, switch, server and two AP injectors. Decide what you would measure before promising 30 minutes of runtime.',
    efficiencyMetric: 'Rack/power documentation makes changes and recovery faster with fewer accidental outages.',
    applicationQuestions: [
      { question: 'What is the best reason to document rack U positions?', options: ['It speeds maintenance and planned changes', 'It creates VLANs', 'It increases bandwidth'], correct: 'It speeds maintenance and planned changes', explanation: 'A rack elevation makes equipment location and changes predictable.' },
      { question: 'Why is “the UPS has enough outlets” not enough for sizing?', options: ['Runtime depends on electrical load and battery capacity', 'UPS devices assign IP addresses', 'Rack units change voltage'], correct: 'Runtime depends on electrical load and battery capacity', explanation: 'Outlet count does not tell you whether the battery can support the load for the required time.' }
    ]
  },
  4: {
    mentalModel: [
      'Structured cabling creates a maintainable channel from equipment room to work area rather than a collection of long patch cords.',
      'Cable category does not guarantee performance if installation, distance or termination is poor.',
      'Labels and test records turn hidden building cable into manageable infrastructure.'
    ],
    technicianMoves: [
      'Trace every permanent run from patch-panel port to outlet ID.',
      'Use consistent termination standards and preserve pair twists.',
      'Test and record each installed link before service handover.',
      'Separate physical-cabling diagnosis from IP configuration diagnosis.'
    ],
    workedExample: 'A PC with no link light on outlet B-17 should be traced through wall jack B-17, horizontal cable, patch-panel port B-17 and the switch patch cord before changing IP settings.',
    fieldDrills: [
      'Trace a complete channel using labels.',
      'Interpret simple cable-tester results for open, short and crossed pairs.',
      'Design an outlet-label convention for one classroom.'
    ],
    failureModes: [
      'Mistake: using cable colour as the only identification method. Fix: use unique endpoint labels and records.',
      'Mistake: changing network settings when the physical channel has failed. Fix: prove Layer 1 first.'
    ],
    masteryEvidence: [
      'Can distinguish permanent link, patch cords and channel.',
      'Can trace a labelled cable path end to end.',
      'Can use test evidence to separate wiring faults from configuration faults.'
    ],
    transferChallenge: 'A wall outlet tests with pair 7–8 open. Explain which layer is failing, what not to troubleshoot yet, and what evidence should be recorded after repair.',
    efficiencyMetric: 'Accurate labels and test records reduce fault-isolation time and unnecessary configuration changes.',
    applicationQuestions: [
      { question: 'A cable tester reports an open pair. What should happen before changing the PC IP address?', options: ['Repair/verify the physical link', 'Change DNS servers', 'Create a VLAN'], correct: 'Repair/verify the physical link', explanation: 'A known Layer-1 fault should be corrected before higher-layer troubleshooting.' },
      { question: 'What makes a structured cabling installation maintainable?', options: ['Consistent termination, labels and test records', 'Using the longest possible patch cords', 'Putting every cable directly into the router'], correct: 'Consistent termination, labels and test records', explanation: 'Documentation and standardized termination make hidden cabling traceable and serviceable.' }
    ]
  },
  5: {
    mentalModel: [
      'Fiber solves distance, bandwidth and interference problems, but the complete optical link must use compatible fiber, connectors and transceivers.',
      'Single-mode and multimode are design choices, not quality grades.',
      'Optical safety and cleanliness matter because damage or contamination can affect both people and link performance.'
    ],
    technicianMoves: [
      'Match fiber type and transceiver specification to distance and equipment.',
      'Check connector type and patch-panel compatibility.',
      'Protect and clean connectors using approved methods.',
      'Never use eyesight to determine whether a fiber is active.'
    ],
    workedExample: 'A 150-metre inter-building link is beyond normal copper Ethernet channel distance and may be exposed to electrical differences, making fiber a strong design choice when appropriate transceivers and pathway protection are available.',
    fieldDrills: [
      'Compare copper, multimode fiber and single-mode fiber for three link distances.',
      'Match LC/SC connectors and SFP-family modules to equipment diagrams.',
      'Identify safe versus unsafe fiber-handling behaviors.'
    ],
    failureModes: [
      'Mistake: assuming any SFP works with any fiber. Fix: verify wavelength, fiber type, speed and device compatibility.',
      'Mistake: looking into a connector for light. Fix: use approved test equipment and safety procedures.'
    ],
    masteryEvidence: [
      'Can justify fiber versus copper for a scenario.',
      'Can name the compatibility checks required for an optical link.',
      'Can describe basic fiber safety rules.'
    ],
    transferChallenge: 'Choose a link medium for two buildings 300 metres apart and list every compatibility item you would verify before ordering.',
    efficiencyMetric: 'Correct medium/transceiver selection prevents expensive mismatches and repeated installation work.',
    applicationQuestions: [
      { question: 'Why can two physically fitting SFP modules still fail to form a link?', options: ['Speed, wavelength or fiber compatibility may differ', 'Fiber has IP addresses', 'Rack labels block light'], correct: 'Speed, wavelength or fiber compatibility may differ', explanation: 'Optical links require compatible device, speed, wavelength and media specifications.' },
      { question: 'What is the correct way to check whether a fiber link is transmitting?', options: ['Use approved test/diagnostic equipment', 'Look directly into the connector', 'Touch the fiber end'], correct: 'Use approved test/diagnostic equipment', explanation: 'Optical energy may be invisible and unsafe to view directly.' }
    ]
  },
  6: {
    mentalModel: [
      'OSI and TCP/IP layers are models for reasoning about responsibilities—not physical boxes.',
      'Encapsulation adds information needed by each layer; decapsulation removes it at the destination.',
      'Layer thinking is most valuable when it narrows the next troubleshooting test.'
    ],
    technicianMoves: [
      'Map symptom evidence to the lowest likely failing layer.',
      'Trace application data into transport, IP, frame and signal.',
      'Avoid jumping to DNS/application fixes when link or IP evidence already shows a lower-layer fault.',
      'Use layer language to communicate clearly with other technicians.'
    ],
    workedExample: 'If a PC has no Ethernet link light, checking DNS first wastes time. If it can ping an IP address but not a hostname, Layer 1–3 evidence already shifts attention toward name resolution/application services.',
    fieldDrills: [
      'Sort networking terms across the seven OSI layers.',
      'Trace one web request through encapsulation and decapsulation.',
      'Classify six faults by the lowest layer likely involved.'
    ],
    failureModes: [
      'Mistake: memorizing layer names without using them. Fix: connect each layer to evidence and tools.',
      'Mistake: assuming one protocol belongs only to one troubleshooting step. Fix: use the model as a guide, not a rigid law.'
    ],
    masteryEvidence: [
      'Can explain encapsulation in plain language.',
      'Can map common protocols/devices to useful layers.',
      'Can choose a next troubleshooting test based on layer evidence.'
    ],
    transferChallenge: 'A user can ping the server IP but cannot open the server by name. Use the OSI/TCP-IP model to explain what is already working and what should be tested next.',
    efficiencyMetric: 'Layer-based diagnosis reduces random checks and narrows the likely fault quickly.',
    applicationQuestions: [
      { question: 'A device has no physical link. Which troubleshooting action is most efficient first?', options: ['Check cable/port/interface state', 'Replace the DNS server', 'Change the web browser'], correct: 'Check cable/port/interface state', explanation: 'A known lower-layer failure should be handled before application services.' },
      { question: 'What is the practical value of encapsulation knowledge?', options: ['It explains what information each layer adds for delivery', 'It makes passwords stronger', 'It changes rack dimensions'], correct: 'It explains what information each layer adds for delivery', explanation: 'Encapsulation connects application data to transport, IP, frames and physical transmission.' }
    ]
  },
  7: {
    mentalModel: [
      'A switch learns where source MAC addresses are seen and forwards frames based on its table.',
      'Broadcasts and unknown destinations have different forwarding behavior from known unicasts.',
      'Loops can multiply frames and destabilize a LAN, which is why loop-prevention design matters.'
    ],
    technicianMoves: [
      'Read source/destination MAC information before guessing forwarding behavior.',
      'Use the MAC table to relate endpoint identity to switch ports.',
      'Check VLAN membership when a learned MAC appears “missing.”',
      'Avoid creating uncontrolled physical loops.'
    ],
    workedExample: 'If host A sends to an unknown MAC, the switch may flood that frame within the VLAN. After the destination replies, the switch learns its source MAC and can forward future frames more selectively.',
    fieldDrills: [
      'Update a paper MAC table as frames arrive.',
      'Predict known-unicast, unknown-unicast and broadcast forwarding.',
      'Diagnose why two hosts on different VLANs do not appear in the same Layer-2 table.'
    ],
    failureModes: [
      'Mistake: believing switches route between IP networks. Fix: separate Layer-2 forwarding from Layer-3 routing.',
      'Mistake: treating a MAC table as permanent. Fix: remember entries age and are learned from traffic.'
    ],
    masteryEvidence: [
      'Can predict switch forwarding from a MAC table.',
      'Can explain how the table is learned.',
      'Can distinguish Layer-2 switching from Layer-3 routing.'
    ],
    transferChallenge: 'Given a four-port MAC table and a new frame, predict where the frame goes and how the table changes after a reply.',
    efficiencyMetric: 'MAC-table evidence replaces unnecessary cable swapping or port guessing.',
    applicationQuestions: [
      { question: 'A switch receives a frame from a new source MAC on port 6. What does it learn?', options: ['That source MAC is reachable via port 6', 'The destination IP must be port 6', 'The DNS server is on port 6'], correct: 'That source MAC is reachable via port 6', explanation: 'Switches learn source MAC-to-port associations from incoming frames.' },
      { question: 'Why might two connected devices not share the same Layer-2 broadcast domain?', options: ['They may be assigned to different VLANs', 'They have different monitor sizes', 'They use different usernames'], correct: 'They may be assigned to different VLANs', explanation: 'VLANs separate Layer-2 broadcast domains even on shared switching hardware.' }
    ]
  },
  8: {
    mentalModel: [
      'An IPv4 address only makes sense together with its prefix/mask because the host must know what is local.',
      'The default gateway is used for off-subnet destinations; it is not “the Internet address.”',
      'Address planning should be documented to prevent overlaps, duplicates and mystery static addresses.'
    ],
    technicianMoves: [
      'Read address, prefix, gateway and DNS as one configuration set.',
      'Determine whether a destination is local before blaming the router.',
      'Recognize private, loopback and common special-use addresses.',
      'Document reserved/static addresses outside general DHCP pools when appropriate.'
    ],
    workedExample: 'Host 192.168.10.25/24 sees 192.168.10.80 as local but sends traffic for 192.168.20.80 toward its default gateway. Changing only the gateway cannot fix a wrong prefix.',
    fieldDrills: [
      'Classify addresses as private, loopback, invalid or public-looking.',
      'Decide local versus off-subnet for /24 examples.',
      'Review a host configuration and identify one contradictory setting.'
    ],
    failureModes: [
      'Mistake: troubleshooting the gateway before checking the host mask/prefix. Fix: validate the whole address set.',
      'Mistake: assigning static addresses without an IP plan. Fix: reserve/document them.'
    ],
    masteryEvidence: [
      'Can explain network versus host portions of an address.',
      'Can decide whether a destination uses local delivery or the gateway.',
      'Can validate a basic host IPv4 configuration.'
    ],
    transferChallenge: 'A host is 192.168.20.50/24 with gateway 192.168.10.1. Explain the inconsistency and what evidence you would collect before changing it.',
    efficiencyMetric: 'Whole-configuration validation catches addressing errors before deeper routing troubleshooting.',
    applicationQuestions: [
      { question: 'A host is 10.1.4.20/24 and its gateway is 10.1.5.1. What should concern you first?', options: ['The gateway is outside the host /24 subnet', 'The address is private', 'The host has four octets'], correct: 'The gateway is outside the host /24 subnet', explanation: 'A normal directly connected default gateway must be reachable on the local subnet.' },
      { question: 'Why document static addresses?', options: ['To reduce duplicates and make ownership clear', 'To increase Ethernet speed', 'To generate MAC addresses'], correct: 'To reduce duplicates and make ownership clear', explanation: 'Address documentation reduces conflicts and troubleshooting ambiguity.' }
    ]
  },
  9: {
    mentalModel: [
      'Subnetting is a capacity and segmentation design decision, not just binary arithmetic.',
      'Prefix size determines address-block size and broadcast-domain scope.',
      'VLSM lets the plan fit different group sizes instead of wasting equal-sized blocks everywhere.'
    ],
    technicianMoves: [
      'Start from required host/device counts and growth.',
      'Choose a prefix that fits each segment with reasonable spare capacity.',
      'Record network, usable range, gateway convention and broadcast address.',
      'Check that proposed subnets do not overlap.'
    ],
    workedExample: 'A /24 can be divided into four /26 networks. Each block advances by 64 addresses: .0, .64, .128 and .192. The design value is four separate segments, not merely the arithmetic.',
    fieldDrills: [
      'Use visual blocks to split /24 into /25, /26 and /27.',
      'Calculate network and broadcast ranges for selected examples.',
      'Design three unequal subnets using VLSM.'
    ],
    failureModes: [
      'Mistake: memorizing host counts without understanding boundaries. Fix: calculate block size and range.',
      'Mistake: allocating subnets without future growth. Fix: include realistic spare capacity.'
    ],
    masteryEvidence: [
      'Can calculate simple subnet boundaries.',
      'Can choose a prefix from a requirement.',
      'Can detect overlapping subnet proposals.'
    ],
    transferChallenge: 'Create a VLSM plan for 50 student devices, 20 staff devices, 10 cameras and a four-address infrastructure segment.',
    efficiencyMetric: 'A documented non-overlapping plan reduces readdressing and configuration mistakes later.',
    applicationQuestions: [
      { question: 'Why would a designer use VLSM?', options: ['Different groups need different address-block sizes', 'It increases cable distance', 'It replaces VLANs'], correct: 'Different groups need different address-block sizes', explanation: 'VLSM lets prefix size match actual capacity requirements.' },
      { question: 'What should be checked before assigning a new subnet?', options: ['That it does not overlap existing networks', 'That every device has the same MAC', 'That the rack has empty space'], correct: 'That it does not overlap existing networks', explanation: 'Overlapping address plans create routing and host ambiguity.' }
    ]
  },
  10: {
    mentalModel: [
      'DHCP, DNS, ARP and ICMP solve different supporting problems and fail in different ways.',
      'A host can have a working link but still fail because address assignment, name resolution or local-neighbor discovery is broken.',
      'Testing services in sequence helps isolate the failing dependency.'
    ],
    technicianMoves: [
      'Check the host IP configuration before testing DNS.',
      'Test IP reachability separately from name resolution.',
      'Use ARP/neighbor evidence for local Layer-2 adjacency questions.',
      'Interpret ping as one data point—not proof that every service works.'
    ],
    workedExample: 'If a PC can ping 1.1.1.1 but cannot resolve a website name, DHCP may have provided a valid address/gateway while DNS configuration or the DNS service remains the likely fault.',
    fieldDrills: [
      'Order DORA and explain each step.',
      'Trace startup from DHCP to ARP to DNS to application traffic.',
      'Diagnose three cases: APIPA/no lease, IP works/name fails, local gateway MAC unresolved.'
    ],
    failureModes: [
      'Mistake: saying “ping works, so the network is fine.” Fix: test the specific service dependency.',
      'Mistake: changing DNS when the host has no valid IP/gateway. Fix: validate configuration in dependency order.'
    ],
    masteryEvidence: [
      'Can distinguish DHCP, DNS, ARP and ICMP roles.',
      'Can select the right test for an addressing versus name-resolution problem.',
      'Can explain what a successful or failed ping does and does not prove.'
    ],
    transferChallenge: 'A laptop has a valid private IP, can ping its gateway and 8.8.8.8, but cannot open sites by name. Build the shortest evidence-based troubleshooting sequence.',
    efficiencyMetric: 'Dependency-order testing avoids changing unrelated services.',
    applicationQuestions: [
      { question: 'A client can reach an Internet IP but not a hostname. What is the best next test?', options: ['DNS resolution', 'Patch-panel continuity', 'UPS runtime'], correct: 'DNS resolution', explanation: 'IP reachability is already proven, so name resolution is the next dependency.' },
      { question: 'What does a successful ping to the gateway prove most directly?', options: ['Some local IP path to the gateway works', 'Every application works', 'DNS is correct'], correct: 'Some local IP path to the gateway works', explanation: 'Ping provides reachability evidence, not proof of all higher-layer services.' }
    ]
  },
  11: {
    mentalModel: [
      'Routing is a table lookup: the router chooses the most specific matching path it knows.',
      'A default route is a fallback, not automatically the preferred route.',
      'Static and dynamic routing solve different scale and change-management needs.'
    ],
    technicianMoves: [
      'Read destination prefix, next hop/interface and route source.',
      'Apply longest-prefix match before default route.',
      'Verify the return path when one-way communication appears.',
      'Document route changes and rollback steps.'
    ],
    workedExample: 'If a routing table contains 10.0.0.0/8, 10.20.0.0/16 and 0.0.0.0/0, traffic for 10.20.5.10 uses the /16 because it is the most specific match.',
    fieldDrills: [
      'Choose routes for several destinations.',
      'Compare static, connected and default routes.',
      'Use a simple traceroute to identify where the path stops.'
    ],
    failureModes: [
      'Mistake: assuming the default route always wins. Fix: use longest-prefix match.',
      'Mistake: checking only the forward route. Fix: consider return routing and stateful security policy.'
    ],
    masteryEvidence: [
      'Can read a simplified routing table.',
      'Can explain longest-prefix match.',
      'Can identify the likely next hop for a destination.'
    ],
    transferChallenge: 'A new /24 is reachable from the router but not from another site. Use route tables and return-path thinking to identify what may be missing.',
    efficiencyMetric: 'Route-table evidence replaces guesswork about where packets should travel.',
    applicationQuestions: [
      { question: 'Which route wins for a destination when both /8 and /24 entries match?', options: ['The /24', 'The /8', 'Always the default route'], correct: 'The /24', explanation: 'Routers prefer the longest, most-specific matching prefix.' },
      { question: 'Why check a return path?', options: ['Communication can fail if replies have no valid route back', 'It increases PoE power', 'It changes DNS names'], correct: 'Communication can fail if replies have no valid route back', explanation: 'Bidirectional communication requires usable forwarding in both directions.' }
    ]
  },
  12: {
    mentalModel: [
      'VLANs separate Layer-2 broadcast domains; routing/firewall policy controls communication between them.',
      'Access ports and trunks serve different purposes.',
      'Segmentation is valuable only when addressing, routing and security policy align with the VLAN design.'
    ],
    technicianMoves: [
      'Define purpose, VLAN ID, subnet and gateway together.',
      'Assign endpoint ports as access ports in the intended VLAN.',
      'Use trunks only where multiple VLANs need to cross a link.',
      'Test both allowed and intentionally blocked inter-VLAN traffic.'
    ],
    workedExample: 'Admin, Students, CCTV and Guest networks can share physical switches while remaining separate VLANs. A Layer-3 gateway then permits only the inter-VLAN communication required by policy.',
    fieldDrills: [
      'Create a VLAN/subnet table for four groups.',
      'Classify switch links as access or trunk.',
      'Write simple allow/deny intent between VLANs.'
    ],
    failureModes: [
      'Mistake: using VLAN names without matching subnets and gateways. Fix: document the complete segment.',
      'Mistake: assuming VLAN separation alone defines security. Fix: add Layer-3 policy and test it.'
    ],
    masteryEvidence: [
      'Can design a small VLAN plan.',
      'Can distinguish access versus trunk links.',
      'Can explain why inter-VLAN routing/security is needed.'
    ],
    transferChallenge: 'Add an IoT VLAN to an existing Admin/Student/Guest design and define exactly what the new VLAN should and should not reach.',
    efficiencyMetric: 'A single VLAN/IP/policy table prevents mismatched configurations across switches, routers and firewalls.',
    applicationQuestions: [
      { question: 'A port connects one ordinary student PC. Which mode is usually appropriate?', options: ['Access port in the Student VLAN', 'Trunk carrying all VLANs', 'WAN-only mode'], correct: 'Access port in the Student VLAN', explanation: 'Ordinary endpoints usually connect through an access port assigned to one VLAN.' },
      { question: 'Why might two VLANs still communicate after segmentation?', options: ['A Layer-3 device may be routing between them', 'VLANs always merge automatically', 'Patch panels route IP traffic'], correct: 'A Layer-3 device may be routing between them', explanation: 'Inter-VLAN routing enables communication unless policy restricts it.' }
    ]
  },
  13: {
    mentalModel: [
      'Wi-Fi is shared radio capacity, so coverage, interference, channel use and client density matter together.',
      'A strong signal does not guarantee low congestion or good application performance.',
      'Wireless security and guest segmentation are part of design—not afterthoughts.'
    ],
    technicianMoves: [
      'Place APs for users and obstacles, not visual symmetry.',
      'Separate coverage problems from capacity/interference problems.',
      'Use appropriate bands/channels for the environment and client capabilities.',
      'Test roaming, guest isolation and real application performance.'
    ],
    workedExample: 'A classroom may show strong signal but poor video performance if too many clients share one AP/channel. Adding power is not necessarily the fix; capacity and channel planning may matter more.',
    fieldDrills: [
      'Place APs on a floor plan and explain each location.',
      'Compare 2.4, 5 and 6 GHz tradeoffs conceptually.',
      'Diagnose strong-signal/poor-performance scenarios.'
    ],
    failureModes: [
      'Mistake: increasing transmit power whenever users complain. Fix: check interference, channel use and client load.',
      'Mistake: putting guest and internal users on one unrestricted network. Fix: segment and apply policy.'
    ],
    masteryEvidence: [
      'Can explain coverage versus capacity.',
      'Can propose reasonable AP placement.',
      'Can include guest/security requirements in a wireless plan.'
    ],
    transferChallenge: 'A youth centre has good reception but slow Wi-Fi at 4 PM when 60 students arrive. Build a test plan before recommending more APs.',
    efficiencyMetric: 'Wireless changes follow measured coverage/capacity evidence instead of signal bars alone.',
    applicationQuestions: [
      { question: 'Strong Wi-Fi signal with poor throughput most strongly suggests what?', options: ['Signal alone is not enough; congestion/interference should be checked', 'The cable must be unplugged', 'DNS cannot work over Wi-Fi'], correct: 'Signal alone is not enough; congestion/interference should be checked', explanation: 'Wireless quality includes capacity, interference and airtime—not only signal strength.' },
      { question: 'What should guest Wi-Fi normally include?', options: ['Separation and restricted access to trusted networks', 'Administrator credentials', 'Unrestricted server access'], correct: 'Separation and restricted access to trusted networks', explanation: 'Guest access should normally be segmented and limited.' }
    ]
  },
  14: {
    mentalModel: [
      'Servers are defined by services they provide, not by physical size.',
      'Virtualization and cloud services change where workloads run, but networking, identity, security and availability still matter.',
      'Service placement should consider dependency, latency, data sensitivity, backup and Internet availability.'
    ],
    technicianMoves: [
      'Name each required service before selecting server hardware.',
      'Map client → network → service dependencies.',
      'Identify what must still work during an Internet outage.',
      'Separate compute, storage, backup and authentication responsibilities.'
    ],
    workedExample: 'A school may keep local file/print services available during an ISP outage while cloud email becomes unreachable. The design should document which services depend on the Internet.',
    fieldDrills: [
      'Match common services to server roles.',
      'Compare local server, VM and cloud-hosted options for one workload.',
      'Draw service dependencies for a user login or shared-file workflow.'
    ],
    failureModes: [
      'Mistake: calling any powerful PC a “server” without naming its service. Fix: define the service and dependency.',
      'Mistake: assuming cloud services remove local-network requirements. Fix: map DNS, routing, Internet and identity dependencies.'
    ],
    masteryEvidence: [
      'Can identify common server roles.',
      'Can compare local, virtual and cloud placement at an introductory level.',
      'Can map a service dependency chain.'
    ],
    transferChallenge: 'Decide which services a small office should keep locally if Internet outages are common, and explain the tradeoff.',
    efficiencyMetric: 'Service maps make outages easier to diagnose and prevent buying technology without a defined role.',
    applicationQuestions: [
      { question: 'What makes a system a server in networking terms?', options: ['It provides a service to clients', 'It must be rack-mounted', 'It must use fiber'], correct: 'It provides a service to clients', explanation: 'Server describes the role of providing networked services.' },
      { question: 'What should be considered before moving a critical service to cloud hosting?', options: ['Internet dependency, data risk, availability and recovery', 'Only the logo of the provider', 'Rack U height'], correct: 'Internet dependency, data risk, availability and recovery', explanation: 'Placement changes dependencies and operational risks.' }
    ]
  },
  15: {
    mentalModel: [
      'Network security is controlled connectivity: permit required communication and reduce unnecessary exposure.',
      'Stateful firewalls, segmentation, identity, patching and physical controls work together.',
      'A firewall rule should be justified by source, destination, service and business/learning need.'
    ],
    technicianMoves: [
      'Start from required flows, not “allow any.”',
      'Use least privilege between network segments.',
      'Document rule purpose and owner.',
      'Test an allowed path and a denied path after changes.'
    ],
    workedExample: 'CCTV cameras may need to reach only their recorder, DNS/NTP if required and approved management stations—not student devices or every Internet destination.',
    fieldDrills: [
      'Convert communication requirements into simple allow/deny rules.',
      'Identify over-broad “any-any” rules.',
      'Trace where NAT, firewall state and VPN fit in a remote-access path.'
    ],
    failureModes: [
      'Mistake: treating NAT as the security policy. Fix: use explicit firewall controls.',
      'Mistake: approving rules without a purpose or expiry/review need. Fix: document the business/technical requirement.'
    ],
    masteryEvidence: [
      'Can explain stateful firewall behavior conceptually.',
      'Can write a least-privilege rule intent.',
      'Can distinguish NAT, VPN and firewall functions.'
    ],
    transferChallenge: 'Design a minimal policy for Guest, Student, Admin, CCTV and Server VLANs, including at least one intentionally denied path you will test.',
    efficiencyMetric: 'Documented required flows make security rules smaller, easier to test and easier to review.',
    applicationQuestions: [
      { question: 'Which firewall rule is generally safest?', options: ['Allow only the required source, destination and service', 'Allow everything and hope endpoints are secure', 'Disable logging for simplicity'], correct: 'Allow only the required source, destination and service', explanation: 'Least-privilege policy limits unnecessary exposure.' },
      { question: 'What is the main purpose of testing a denied path?', options: ['To prove segmentation/security policy actually blocks it', 'To increase throughput', 'To assign DHCP addresses'], correct: 'To prove segmentation/security policy actually blocks it', explanation: 'Security verification must test negative expectations as well as successful traffic.' }
    ]
  },
  16: {
    mentalModel: [
      'Operations turns a one-time working network into a maintainable service.',
      'Monitoring is useful when a metric has a normal range, threshold and response owner.',
      'Logs, inventories, backups and change records provide evidence during incidents.'
    ],
    technicianMoves: [
      'Define what “healthy” looks like for critical devices/links.',
      'Monitor actionable signals such as availability, utilization, loss, errors and capacity.',
      'Back up configurations and test restoration procedures.',
      'Record changes before incidents make memory unreliable.'
    ],
    workedExample: 'A switch uplink at 95% utilization with rising discards during peak hours is stronger evidence of congestion than a user report saying “the network feels slow.”',
    fieldDrills: [
      'Interpret a simple monitoring dashboard.',
      'Create one metric → threshold → alert → owner response rule.',
      'Use a change log to investigate an incident timeline.'
    ],
    failureModes: [
      'Mistake: collecting every metric without action rules. Fix: monitor signals tied to decisions.',
      'Mistake: keeping backups that have never been restored/tested. Fix: include recovery tests.'
    ],
    masteryEvidence: [
      'Can choose useful network-health metrics.',
      'Can connect an alert to a technician response.',
      'Can explain why configuration backups and change logs matter.'
    ],
    transferChallenge: 'Create a monitoring plan for a small school network with five metrics, thresholds and named responses.',
    efficiencyMetric: 'Operations evidence finds abnormal behavior before technicians resort to user reports and guesswork.',
    applicationQuestions: [
      { question: 'What makes a monitoring alert useful?', options: ['It has a meaningful threshold and response action', 'It creates as many messages as possible', 'It never changes'], correct: 'It has a meaningful threshold and response action', explanation: 'Actionable alerts connect observed conditions to a decision or response.' },
      { question: 'Why test configuration restoration?', options: ['A backup is only useful if it can actually support recovery', 'It increases switch speed', 'It changes VLAN IDs'], correct: 'A backup is only useful if it can actually support recovery', explanation: 'Recovery testing validates that backups are complete and usable.' }
    ]
  },
  17: {
    mentalModel: [
      'Troubleshooting is a controlled experiment: define the symptom, gather evidence, test one hypothesis, change one thing, verify and document.',
      'The fastest technicians are not the ones who change the most settings; they reduce the fault domain fastest.',
      'Root cause, service restoration and prevention are separate but related outcomes.'
    ],
    technicianMoves: [
      'Define scope: one user, one VLAN, one site or everyone.',
      'Check known-good boundaries and recent changes.',
      'Use the OSI/dependency model to select the next test.',
      'Record evidence and verify the fix from the user/service perspective.'
    ],
    workedExample: 'If only one PC fails while neighboring PCs work, begin with that endpoint/link/configuration instead of rebooting the router for the entire site.',
    fieldDrills: [
      'Diagnose six deliberately broken scenarios.',
      'Build a decision tree for no link, no IP, no gateway, no DNS and blocked service.',
      'Write a root-cause statement that separates symptom from cause.'
    ],
    failureModes: [
      'Mistake: changing several settings at once. Fix: one hypothesis and one controlled change.',
      'Mistake: stopping when service returns. Fix: verify root cause, document and prevent recurrence.'
    ],
    masteryEvidence: [
      'Can produce a clear problem statement.',
      'Can choose evidence-based tests in sequence.',
      'Can explain root cause and verification separately.'
    ],
    transferChallenge: 'A new fault scenario is introduced without telling you the cause. Diagnose it and submit the evidence trail—not just the final answer.',
    efficiencyMetric: 'The number of unrelated changes is minimized while evidence narrows the fault domain.',
    applicationQuestions: [
      { question: 'Only one workstation is affected while others on the same switch work. What should you do first?', options: ['Narrow the test to that endpoint/link/configuration', 'Restart every router', 'Replace the ISP'], correct: 'Narrow the test to that endpoint/link/configuration', explanation: 'The scope already provides evidence that the problem is likely localized.' },
      { question: 'Why document a root cause after service is restored?', options: ['To prevent recurrence and improve future troubleshooting', 'To make the outage longer', 'To change the DNS suffix'], correct: 'To prevent recurrence and improve future troubleshooting', explanation: 'Restoration fixes the immediate service; root-cause learning improves the system.' }
    ]
  },
  18: {
    mentalModel: [
      'Network design translates requirements into physical, logical, security, capacity and recovery decisions.',
      'Every design choice should trace back to a requirement, constraint or risk.',
      'A design is incomplete if another technician cannot understand, build and test it from the documentation.'
    ],
    technicianMoves: [
      'Start with users, devices, services, locations, performance and security needs.',
      'Create physical and logical views separately.',
      'Identify capacity, growth and single points of failure.',
      'Review the design against requirements before choosing final products.'
    ],
    workedExample: 'A small learning centre may need 48 wired ports, PoE for APs/cameras, separate Admin/Student/Guest/CCTV VLANs, local services and UPS-backed core devices. Those requirements should appear explicitly in the design pack.',
    fieldDrills: [
      'Turn a customer brief into technical requirements.',
      'Compare physical versus logical diagrams.',
      'Run a design review and find five missing assumptions.'
    ],
    failureModes: [
      'Mistake: drawing equipment before defining requirements. Fix: requirements first.',
      'Mistake: producing a diagram with no addressing, labels or testable intent. Fix: add the information needed to build and verify.'
    ],
    masteryEvidence: [
      'Can translate requirements into design choices.',
      'Can produce complementary physical/logical documentation.',
      'Can identify tradeoffs and single points of failure.'
    ],
    transferChallenge: 'Receive a change request that adds 20 users and a second floor. Update the design and explain which assumptions or components must change.',
    efficiencyMetric: 'Traceable requirements reduce redesign and prevent hardware choices from becoming arbitrary.',
    applicationQuestions: [
      { question: 'What should happen before selecting specific network products?', options: ['Define requirements and constraints', 'Choose the most expensive switch', 'Assign random VLAN IDs'], correct: 'Define requirements and constraints', explanation: 'Requirements should drive the architecture and product selection.' },
      { question: 'Why keep physical and logical diagrams separate?', options: ['They answer different questions about equipment/cabling versus networks/traffic', 'One is only decorative', 'Logical diagrams increase voltage'], correct: 'They answer different questions about equipment/cabling versus networks/traffic', explanation: 'Separate views make both physical implementation and logical behavior clearer.' }
    ]
  },
  19: {
    mentalModel: [
      'Implementation should convert an approved design into a tested service in controlled stages.',
      'A test plan defines success before configuration begins.',
      'Rollback and backups reduce the risk of changes that do not behave as expected.'
    ],
    technicianMoves: [
      'Build and test from lower layers/services upward.',
      'Record expected versus actual results.',
      'Save configuration checkpoints before risky changes.',
      'Do not declare completion until security and failure/negative tests also pass.'
    ],
    workedExample: 'A staged build may verify physical link → VLAN placement → IP/DHCP → routing → DNS/services → firewall policy → Wi-Fi → application behavior, making failures easier to localize.',
    fieldDrills: [
      'Turn five design requirements into pass/fail tests.',
      'Create a pre-change and rollback checklist.',
      'Introduce one fault and prove the troubleshooting process finds it.'
    ],
    failureModes: [
      'Mistake: configuring everything before the first test. Fix: verify each stage.',
      'Mistake: testing only what should work. Fix: also test what should be blocked or fail safely.'
    ],
    masteryEvidence: [
      'Can create test cases from requirements.',
      'Can execute staged verification.',
      'Can document actual results and deviations.'
    ],
    transferChallenge: 'Implement one design change in the simulator/lab and produce change plan, rollback step, test evidence and final documentation update.',
    efficiencyMetric: 'Stage gates catch mistakes near where they are introduced instead of at the end of the build.',
    applicationQuestions: [
      { question: 'Why test after each implementation stage?', options: ['To catch faults close to where they were introduced', 'To increase cable category', 'To reduce IP address length'], correct: 'To catch faults close to where they were introduced', explanation: 'Incremental testing keeps the fault domain small.' },
      { question: 'What is a negative test?', options: ['A test proving traffic/action that should be blocked is actually blocked', 'A test with no expected result', 'A test only for damaged cables'], correct: 'A test proving traffic/action that should be blocked is actually blocked', explanation: 'Security and control requirements need evidence for denied behavior too.' }
    ]
  },
  20: {
    mentalModel: [
      'Real network competence is transferable: a technician should solve a new design/fault problem without copying the class example.',
      'A professional demonstration explains requirements, evidence, tradeoffs, risks and recovery—not just which buttons were clicked.',
      'Incident response and design review test the same habit: reason from evidence and document decisions.'
    ],
    technicianMoves: [
      'Start the unfamiliar scenario by defining scope and requirements.',
      'Use diagrams, tables and tests as evidence.',
      'Explain at least one rejected option/tradeoff.',
      'Present a verified result and a realistic next improvement.'
    ],
    workedExample: 'During the final benchmark, the instructor might change a requirement, break a VLAN/gateway/DNS path or introduce a failed uplink. The learner should diagnose or redesign from evidence rather than being told which command to use.',
    fieldDrills: [
      'Complete one unfamiliar troubleshooting scenario.',
      'Complete one design-change request with documentation updates.',
      'Defend one technical choice and one risk decision.'
    ],
    failureModes: [
      'Mistake: memorizing the class topology and repeating it. Fix: require a new scenario.',
      'Mistake: presenting a polished diagram without test evidence. Fix: show requirement → decision → test result.'
    ],
    masteryEvidence: [
      'Can diagnose an unfamiliar network fault methodically.',
      'Can adapt a design to a new requirement.',
      'Can explain decisions, test evidence, risks and documentation in their own words.',
      'Can state when to escalate or stop rather than making an unsafe change.'
    ],
    transferChallenge: 'Complete the Network Technician Benchmark: solve an unfamiliar fault plus one design-change request, then explain your evidence trail and updated documentation.',
    efficiencyMetric: 'The learner reaches a defensible answer with controlled tests, minimal unrelated changes and complete handoff evidence.',
    applicationQuestions: [
      { question: 'What best proves final networking competence?', options: ['Solving a new scenario using evidence and explaining the process', 'Repeating the instructor topology from memory', 'Naming the most device brands'], correct: 'Solving a new scenario using evidence and explaining the process', explanation: 'Transfer to unfamiliar problems demonstrates usable skill.' },
      { question: 'When should a junior technician stop and escalate?', options: ['When the change is unsafe, unauthorized or beyond the approved scope', 'Never; always keep changing settings', 'Only when the rack is full'], correct: 'When the change is unsafe, unauthorized or beyond the approved scope', explanation: 'Professional judgment includes knowing when not to make a change.' }
    ]
  }
};
