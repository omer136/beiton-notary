#!/usr/bin/env python3
"""
מתרגם משולש — מריץ תרגום דרך 3 APIs במקביל ומחזיר השוואה.

שימוש:
    python multi_translate.py --text "טקסט לתרגום" --source he --target en
    python multi_translate.py --file path/to/source.txt --source he --target en
    python multi_translate.py --file path/to/source.txt --source he --target en --out results.json

דרישות סביבה:
    ANTHROPIC_API_KEY   — מפתח API של Anthropic
    OPENAI_API_KEY      — מפתח API של OpenAI
    DEEPL_API_KEY       — מפתח API של DeepL
"""

import argparse
import asyncio
import json
import os
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Language maps
# ---------------------------------------------------------------------------

LANG_NAMES = {
    "he": "Hebrew", "en": "English", "ru": "Russian", "ar": "Arabic",
    "fr": "French", "es": "Spanish", "de": "German",
}

DEEPL_LANG_MAP = {
    "he": "HE", "en": "EN-US", "ru": "RU", "ar": "AR",
    "fr": "FR", "es": "ES", "de": "DE",
}

# ---------------------------------------------------------------------------
# System prompt shared by Claude and GPT-4
# ---------------------------------------------------------------------------

TRANSLATION_SYSTEM = (
    "You are a certified legal translator specializing in Israeli official "
    "documents. Translate faithfully with these rules:\n"
    "1. Transliterate names — do not translate them.\n"
    "2. Convert dates to 'Month DD, YYYY' format; keep Hebrew dates with "
    "Gregorian in parentheses.\n"
    "3. Copy ID numbers, reference numbers, and file numbers exactly.\n"
    "4. Use standard legal terminology.\n"
    "5. Mark illegible text as [illegible in original].\n"
    "6. Do not add, remove, or rephrase content.\n"
    "7. Preserve document structure."
)

# ---------------------------------------------------------------------------
# Individual translation functions
# ---------------------------------------------------------------------------

async def translate_claude(text: str, source: str, target: str) -> dict:
    """Translate via Anthropic Claude API."""
    try:
        import anthropic
    except ImportError:
        return _error_result("claude", "anthropic package not installed — pip install anthropic")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _error_result("claude", "ANTHROPIC_API_KEY not set")

    client = anthropic.Anthropic(api_key=api_key)
    model = "claude-sonnet-4-6-20250514"
    user_msg = (
        f"Translate the following from {LANG_NAMES.get(source, source)} to "
        f"{LANG_NAMES.get(target, target)}. Return ONLY the translation.\n\n"
        f"---\n{text}\n---"
    )

    start = time.time()
    try:
        response = client.messages.create(
            model=model,
            max_tokens=4096,
            system=TRANSLATION_SYSTEM,
            messages=[{"role": "user", "content": user_msg}],
        )
        translated = response.content[0].text
        duration = int((time.time() - start) * 1000)
        input_tokens = getattr(response.usage, "input_tokens", 0)
        output_tokens = getattr(response.usage, "output_tokens", 0)
        cost = input_tokens * 3e-6 + output_tokens * 15e-6  # Sonnet pricing
        return {
            "engine": "claude",
            "model": model,
            "text": translated,
            "duration_ms": duration,
            "cost_usd": round(cost, 4),
            "error": None,
        }
    except Exception as e:
        return _error_result("claude", str(e))


async def translate_gpt4(text: str, source: str, target: str) -> dict:
    """Translate via OpenAI GPT-4o API."""
    try:
        import openai
    except ImportError:
        return _error_result("gpt4", "openai package not installed — pip install openai")

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return _error_result("gpt4", "OPENAI_API_KEY not set")

    client = openai.OpenAI(api_key=api_key)
    model = "gpt-4o"
    user_msg = (
        f"Translate the following from {LANG_NAMES.get(source, source)} to "
        f"{LANG_NAMES.get(target, target)}. Return ONLY the translation.\n\n"
        f"---\n{text}\n---"
    )

    start = time.time()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": TRANSLATION_SYSTEM},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=4096,
        )
        translated = response.choices[0].message.content
        duration = int((time.time() - start) * 1000)
        usage = response.usage
        cost = (usage.prompt_tokens * 2.5e-6 + usage.completion_tokens * 10e-6) if usage else 0
        return {
            "engine": "gpt4",
            "model": model,
            "text": translated,
            "duration_ms": duration,
            "cost_usd": round(cost, 4),
            "error": None,
        }
    except Exception as e:
        return _error_result("gpt4", str(e))


async def translate_deepl(text: str, source: str, target: str) -> dict:
    """Translate via DeepL API."""
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        return _error_result("deepl", "DEEPL_API_KEY not set")

    source_lang = DEEPL_LANG_MAP.get(source)
    target_lang = DEEPL_LANG_MAP.get(target)
    if not target_lang:
        return _error_result("deepl", f"Unsupported target language: {target}")

    try:
        import httpx
    except ImportError:
        return _error_result("deepl", "httpx package not installed — pip install httpx")

    # Detect free vs pro key
    base_url = (
        "https://api-free.deepl.com" if api_key.endswith(":fx")
        else "https://api.deepl.com"
    )

    start = time.time()
    try:
        async with httpx.AsyncClient() as http:
            payload = {
                "text": [text],
                "target_lang": target_lang,
            }
            if source_lang:
                payload["source_lang"] = source_lang

            resp = await http.post(
                f"{base_url}/v2/translate",
                headers={"Authorization": f"DeepL-Auth-Key {api_key}"},
                json=payload,
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
            translated = data["translations"][0]["text"]
            duration = int((time.time() - start) * 1000)
            char_count = len(text)
            cost = char_count * 20e-6  # $20 per 1M chars
            return {
                "engine": "deepl",
                "model": "deepl-v2",
                "text": translated,
                "duration_ms": duration,
                "cost_usd": round(cost, 4),
                "error": None,
            }
    except Exception as e:
        return _error_result("deepl", str(e))


def _error_result(engine: str, message: str) -> dict:
    return {
        "engine": engine,
        "model": None,
        "text": None,
        "duration_ms": 0,
        "cost_usd": 0,
        "error": message,
    }


# ---------------------------------------------------------------------------
# Comparison logic
# ---------------------------------------------------------------------------

def compare_translations(results: list[dict], source_text: str) -> dict:
    """Basic automated comparison of the three translations."""
    successful = [r for r in results if r["error"] is None]

    if not successful:
        return {"winner": None, "reason": "All engines failed", "scores": {}}

    if len(successful) == 1:
        return {
            "winner": successful[0]["engine"],
            "reason": "Only one engine succeeded",
            "scores": {successful[0]["engine"]: {"auto_score": "N/A"}},
        }

    scores = {}
    source_words = source_text.split()
    source_word_count = len(source_words)

    # Extract numbers and potential IDs from source
    import re
    source_numbers = set(re.findall(r'\d{3,}', source_text))

    for r in successful:
        engine = r["engine"]
        translated = r["text"] or ""
        trans_words = translated.split()

        # Heuristic scoring
        score = 0

        # 1. Length ratio — translation should be roughly similar length (±50%)
        ratio = len(trans_words) / max(source_word_count, 1)
        if 0.5 <= ratio <= 2.0:
            score += 20
        elif 0.3 <= ratio <= 3.0:
            score += 10

        # 2. Numbers preserved — all numbers from source should appear in translation
        trans_numbers = set(re.findall(r'\d{3,}', translated))
        if source_numbers:
            preserved = len(source_numbers & trans_numbers) / len(source_numbers)
            score += int(preserved * 30)
        else:
            score += 30  # No numbers to check

        # 3. No untranslated source fragments left (for he→en: no Hebrew chars)
        he_chars = len(re.findall(r'[\u0590-\u05FF]', translated))
        if he_chars == 0:
            score += 20
        elif he_chars < 5:
            score += 10

        # 4. Structure preserved — similar number of newlines
        source_lines = source_text.count('\n')
        trans_lines = translated.count('\n')
        if source_lines > 0:
            line_ratio = trans_lines / source_lines
            if 0.7 <= line_ratio <= 1.5:
                score += 15
            elif 0.5 <= line_ratio <= 2.0:
                score += 8
        else:
            score += 15

        # 5. Bonus for speed
        if r["duration_ms"] < 2000:
            score += 5
        elif r["duration_ms"] < 5000:
            score += 3

        scores[engine] = {
            "auto_score": score,
            "word_count": len(trans_words),
            "numbers_preserved": f"{len(source_numbers & trans_numbers)}/{len(source_numbers)}" if source_numbers else "N/A",
            "duration_ms": r["duration_ms"],
            "cost_usd": r["cost_usd"],
        }

    # Pick winner
    best_engine = max(scores, key=lambda e: scores[e]["auto_score"])

    return {
        "winner": best_engine,
        "reason": f"Highest auto-score ({scores[best_engine]['auto_score']})",
        "scores": scores,
        "note": "Auto-score is heuristic only. Agent 2 performs full semantic comparison separately.",
    }


# ---------------------------------------------------------------------------
# Main orchestrator
# ---------------------------------------------------------------------------

async def run_translations(text: str, source: str, target: str) -> dict:
    """Run all three translations in parallel and return comparison."""
    tasks = [
        translate_claude(text, source, target),
        translate_gpt4(text, source, target),
        translate_deepl(text, source, target),
    ]
    results = await asyncio.gather(*tasks)

    comparison = compare_translations(list(results), text)

    word_count = len(text.split())

    output = {
        "source_text": text,
        "source_language": source,
        "target_language": target,
        "word_count": word_count,
        "translations": {r["engine"]: r for r in results},
        "comparison": comparison,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    return output


def print_report(data: dict):
    """Print a human-readable comparison report."""
    print(f"\n{'='*60}")
    print(f"  דו״ח תרגום משולש — Multi-Translation Report")
    print(f"{'='*60}")
    print(f"  שפת מקור: {data['source_language']}  →  שפת יעד: {data['target_language']}")
    print(f"  מילים במקור: {data['word_count']}")
    print(f"  זמן: {data['timestamp']}")
    print()

    for engine, result in data["translations"].items():
        status = "✅" if result["error"] is None else "❌"
        print(f"  {status} {engine.upper()}")
        if result["error"]:
            print(f"     שגיאה: {result['error']}")
        else:
            print(f"     מודל: {result['model']}")
            print(f"     זמן: {result['duration_ms']}ms")
            print(f"     עלות: ${result['cost_usd']}")
            preview = (result["text"] or "")[:120].replace("\n", " ")
            print(f"     תצוגה מקדימה: {preview}...")
        print()

    comp = data["comparison"]
    print(f"  {'─'*50}")
    print(f"  🏆 מנצח: {(comp['winner'] or 'אין').upper()}")
    print(f"     סיבה: {comp['reason']}")
    if comp.get("scores"):
        print()
        print(f"     {'מערכת':<10} {'ציון':<8} {'מילים':<8} {'מספרים':<12} {'זמן':<8} {'עלות':<8}")
        print(f"     {'─'*54}")
        for eng, s in comp["scores"].items():
            score = s.get("auto_score", "?")
            wc = s.get("word_count", "?")
            nums = s.get("numbers_preserved", "?")
            dur = s.get("duration_ms", "?")
            cost = s.get("cost_usd", "?")
            print(f"     {eng:<10} {str(score):<8} {str(wc):<8} {str(nums):<12} {str(dur):<8} ${cost}")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="תרגום משולש — 3 APIs במקביל",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--text", help="טקסט לתרגום (ישירות)")
    group.add_argument("--file", help="קובץ טקסט לתרגום")
    parser.add_argument("--source", required=True, help="שפת מקור (he/en/ru/ar)")
    parser.add_argument("--target", required=True, help="שפת יעד (he/en/ru/ar)")
    parser.add_argument("--out", help="שמור תוצאות ל-JSON")
    parser.add_argument("--quiet", action="store_true", help="ללא פלט לטרמינל")

    args = parser.parse_args()

    if args.text:
        source_text = args.text
    else:
        source_text = Path(args.file).read_text(encoding="utf-8")

    if not source_text.strip():
        print("שגיאה: טקסט ריק", file=sys.stderr)
        sys.exit(1)

    data = asyncio.run(run_translations(source_text, args.source, args.target))

    if not args.quiet:
        print_report(data)

    if args.out:
        out_path = Path(args.out)
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        if not args.quiet:
            print(f"  💾 תוצאות נשמרו: {out_path}")

    # Always output JSON to stdout if quiet
    if args.quiet:
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
