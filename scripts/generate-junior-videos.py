#!/usr/bin/env python3
"""Generate the 16 V79 Junior AI Academy narrated mission intros.

Requires: python3, ffmpeg, espeak, DejaVu Sans font.
The videos are generated during the production Docker build so the curriculum
keeps deterministic, reviewable source instead of opaque checked-in binaries.
"""

from __future__ import annotations
import os
import shutil
import subprocess
import tempfile
import textwrap
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "junior-ai" / "media"
def find_font(filename: str) -> str:
    candidates = [
        Path("/usr/share/fonts/TTF") / filename,
        Path("/usr/share/fonts/ttf-dejavu") / filename,
        Path("/usr/share/fonts/truetype/dejavu") / filename,
        Path("/usr/share/fonts/dejavu") / filename,
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    for candidate in Path("/usr/share/fonts").rglob(filename):
        return str(candidate)
    raise SystemExit(f"Could not find required font: {filename}")

FONT = find_font("DejaVuSans.ttf")
FONT_BOLD = find_font("DejaVuSans-Bold.ttf")

MISSIONS = [
    ("Welcome to the World of AI", "AI is a useful pattern-based tool, not an all-knowing person.", "Decide what small job AI should do, what information it really needs, and what a human must still check.", "Choose one real task and explain whether AI, a simpler tool, or human judgment should lead."),
    ("Prompt Power", "Efficient prompts combine a goal, useful context, constraints and a clear output format.", "Use focused follow-ups to fix one weak part instead of rewriting everything.", "Create reusable prompt patterns for generate, summarize, extract, transform and compare."),
    ("Safe, Smart & Ethical AI", "Good AI work protects privacy, permission, identity and honesty.", "Share the minimum information needed and remove private details before prompting.", "Turn a risky prompt into a safe version and explain what you removed."),
    ("Become a Fact Detective", "AI can organize research, but external sources provide the evidence.", "Separate claims from evidence, check dates, and compare sources before trusting an important answer.", "Fact-check one surprising AI claim and document the evidence."),
    ("AI Everywhere", "Efficient AI users choose tools by the job, not because AI is available.", "Compare AI with calculators, search, trusted sources and human judgment, including the time needed to check AI output.", "Build an AI-or-not decision card for future tasks."),
    ("AI Image Studio", "Strong image work starts with purpose, audience, composition and a few important visual constraints.", "Change one visual variable at a time and inspect generated images for errors or misleading implications.", "Adapt one visual idea for a thumbnail, poster and presentation format."),
    ("Story & Writing Lab", "Use AI in stages: ideas, outline, draft, critique and revision.", "Keep authorship by asking AI for options and feedback instead of one finished piece you cannot explain.", "Show a before-and-after revision and identify what the human changed."),
    ("AI Audio Studio", "Plan message, timing and script before choosing voices, music or effects.", "Translate duration into a practical script length, test a short sample and listen through the full result.", "Turn one message into a short announcement, podcast intro and narration script."),
    ("AI Video Studio", "Efficient video creation begins with a storyboard and shot list.", "Give every scene one job, keep factual material verified and maintain visual continuity across generated assets.", "Build a six-scene storyboard before generating the final clips."),
    ("Presentation Power", "Plan the story and evidence before designing slides.", "Use AI to organize verified notes, shorten text and suggest visuals without inventing statistics or sources.", "Turn verified notes into a six-slide outline with one purpose per slide."),
    ("Content Creator & Promotion Lab", "Repurpose one verified core message across formats without changing the facts.", "Generate variants, score them for clarity and audience fit, then publish only the strongest human-edited version.", "Adapt one approved message into a poster, caption and short script."),
    ("AI Workflow Wizard", "Complex AI work becomes reliable when it is broken into steps with clear handoffs and quality gates.", "Specify each step's input, owner, output format and check, then save prompts that are worth reusing.", "Map a reusable workflow and identify where an error could spread."),
    ("AI Problem Solver", "AI is good at widening options; humans should choose with real constraints and evidence.", "Define the problem before the solution, generate meaningfully different approaches, score them against criteria and test a small prototype.", "Solve the same problem under a new constraint and compare the best option."),
    ("Young AI Entrepreneur", "AI can support business thinking, but customer demand, prices and promises must stay grounded.", "Use AI to organize assumptions and questions, not to invent customers, reviews or financial evidence.", "Create a simple offer and list the assumptions that still need real-world testing."),
    ("Final Production Sprint", "Final quality comes from explicit acceptance criteria, not asking AI whether something 'looks good'.", "Audit accuracy, privacy, accessibility, consistency and requirements, then fix the highest-impact problems first.", "Run a structured quality audit and verify the AI's flags yourself."),
    ("AI Creator Showcase & Portfolio", "Real AI skill is visible in the process: choices, prompts, checks, revisions and reusable methods.", "Build a personal AI Playbook with prompt templates, workflows, verification rules and situations where you will not use AI.", "Use your playbook on a new task and explain what transferred and what had to change."),
]

PALETTES = [
    ("4f46e5","8b5cf6"),("7c3aed","ec4899"),("0f766e","22c55e"),("0369a1","06b6d4"),
    ("b45309","f59e0b"),("be185d","f472b6"),("7e22ce","a855f7"),("0e7490","14b8a6"),
    ("1d4ed8","60a5fa"),("4338ca","818cf8"),("c2410c","fb923c"),("0f766e","2dd4bf"),
    ("15803d","4ade80"),("a16207","facc15"),("b91c1c","fb7185"),("6d28d9","c084fc"),
]

def run(args: list[str]) -> None:
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def require(exe: str) -> None:
    if not shutil.which(exe):
        raise SystemExit(f"Missing required executable: {exe}")

def wav_seconds(path: Path) -> float:
    with wave.open(str(path), "rb") as f:
        return f.getnframes() / float(f.getframerate())

def wrap(text: str, width: int) -> str:
    return "\n".join(textwrap.wrap(text, width=width, break_long_words=False))

def ffmpeg_escape(path: Path) -> str:
    return str(path).replace("\\", "/").replace(":", "\\:")

def make_segment(work: Path, mission: int, label: str, title: str, body: str, c1: str, wav: Path, output: Path) -> float:
    title_file = work / f"title-{label}.txt"
    body_file = work / f"body-{label}.txt"
    title_file.write_text(wrap(title, 25), encoding="utf-8")
    body_file.write_text(wrap(body, 48), encoding="utf-8")
    duration = wav_seconds(wav) + 0.45
    vf = (
        f"drawtext=fontfile={FONT_BOLD}:text='V79 JUNIOR AI  •  MISSION {mission:02d}':fontcolor=white@0.92:fontsize=18:x=28:y=22,"
        f"drawtext=fontfile={FONT_BOLD}:text='{label.upper()}':fontcolor=white@0.86:fontsize=17:x=28:y=60,"
        f"drawtext=fontfile={FONT_BOLD}:textfile='{ffmpeg_escape(title_file)}':fontcolor=white:fontsize=34:line_spacing=4:x=28:y=98,"
        f"drawtext=fontfile={FONT}:textfile='{ffmpeg_escape(body_file)}':fontcolor=white:fontsize=20:line_spacing=4:x=28:y=182,"
        "fade=t=in:st=0:d=0.2,fade=t=out:st=" + f"{max(0.2,duration-0.25):.2f}" + ":d=0.2,format=yuv420p"
    )
    run([
        "ffmpeg","-y",
        "-f","lavfi","-i",f"color=c=0x{c1}:s=640x360:r=12",
        "-i",str(wav),
        "-t",f"{duration:.2f}",
        "-vf",vf,
        "-c:v","libx264","-preset","veryfast","-b:v","90k","-maxrate","120k","-bufsize","180k",
        "-c:a","aac","-b:a","32k","-ac","1","-ar","22050",
        "-shortest",str(output)
    ])
    return duration

def write_vtt(path: Path, cues: list[tuple[float,float,str]]) -> None:
    def stamp(sec: float) -> str:
        ms = int(round(sec * 1000))
        h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
    lines = ["WEBVTT", ""]
    for i,(start,end,text) in enumerate(cues,1):
        lines += [str(i), f"{stamp(start)} --> {stamp(end)}", text, ""]
    path.write_text("\n".join(lines), encoding="utf-8")

def generate_mission(index: int, title: str, key: str, efficiency: str, challenge: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"mission-{index:02d}-intro.mp4"
    c1,_ = PALETTES[index-1]
    slides = [
        ("Welcome", title, f"Mission {index}. {title}."),
        ("Big Idea", "Today's Big Idea", key),
        ("Efficiency", "Work Smarter With AI", efficiency),
        ("Check", "Human Check", "Before keeping an AI result, check whether it followed the instructions, whether important claims are supported, and what a human still needs to decide."),
        ("Challenge", "Your Mission", challenge),
    ]
    with tempfile.TemporaryDirectory(prefix=f"jai-{index:02d}-") as td:
        work = Path(td)
        segments: list[Path] = []
        cues: list[tuple[float,float,str]] = []
        cursor = 0.0
        for number,(label,slide_title,body) in enumerate(slides,1):
            narration = f"{label}. {slide_title}. {body}"
            wav = work / f"{number}.wav"
            seg = work / f"{number}.mp4"
            run(["espeak","-s","185","-p","50","-a","155","-w",str(wav),narration])
            duration = make_segment(work,index,f"{number}-{label}",slide_title,body,c1,wav,seg)
            segments.append(seg)
            cues.append((cursor,cursor+duration,narration))
            cursor += duration

        concat = work / "concat.txt"
        concat.write_text("\n".join(f"file '{p}'" for p in segments), encoding="utf-8")
        run(["ffmpeg","-y","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(dest)])
        write_vtt(dest.with_suffix(".vtt"), cues)
        dest.with_suffix(".txt").write_text(
            f"Mission {index}: {title}\n\n" + "\n".join(text for _,_,text in cues),
            encoding="utf-8"
        )

if __name__ == "__main__":
    require("ffmpeg")
    require("espeak")
    for i,(title,key,efficiency,challenge) in enumerate(MISSIONS,1):
        generate_mission(i,title,key,efficiency,challenge)
    print(f"Generated {len(MISSIONS)} Junior AI Academy videos in {OUT}")
