#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extracts all "Wesen" (creatures) from scratch/pdf/Elektronisches Bestiarium.pdf
into scratch/pdf/wesen_list.json, matching the app/models/bestiarium.ts Wesen
interface.

Requires poppler-utils (`pdftotext`/`pdfinfo` on PATH, e.g. `brew install poppler`).

Usage:
    python3 scripts/parse_bestiarium.py

How it works:
    The book uses a two-column layout: a flavor-text column on the left and a
    boxed stat-block column on the right. `pdftotext -layout` interleaves both
    columns line-by-line, which is unreliable to parse directly, so this script
    first crops every page to just the right-hand stat-block column via
    `pdftotext -x/-y/-W/-H`, then runs a small line-classification state machine
    over the cropped text to split each creature's box into fields (LP/AP, St/Gw/
    In/B, Abwehr/Resistenz, Angriff, Bes., Zaubern, Vorkommen, Besondere Wesen),
    and finally regexes each field into the Wesen JSON shape.

Known limitations (see the "warnings" section of the generated parse_log.txt):
    - A handful of very-high-grade creatures have extra footnote text inside
      their exceptional-tier ("Besondere Wesen") table that isn't captured -
      the core Grad/Gf/St/LP/AP/Angriff/Raufen/Abwehr/Resistenz/Schaden columns
      still parse correctly.
    - `regionen` tagging is a best-effort keyword match against the app's fixed
      9-region list (see useBestiarium.ts); the book's full location text is
      always preserved verbatim in `vorkommen` regardless of whether tagging
      succeeds.
    - Rare PDF text-extraction corruption (e.g. a scrambled "Vorkommen:" line)
      can still garble a field for an isolated entry - spot-check the log.
"""
import re
import json
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = PROJECT_ROOT / "scratch" / "pdf" / "Elektronisches Bestiarium.pdf"
OUT = PROJECT_ROOT / "scratch" / "pdf" / "wesen_list.json"
LOG = PROJECT_ROOT / "scratch" / "pdf" / "parse_log.txt"

# The stat-block column starts at this x-offset (in PDF points) on every page.
RIGHT_COLUMN_X = 300

REGION_KEYWORDS = [
    ("Berg- und Hügelland", ["berg", "hügel", "gebirg", "fels", "höhenzug"]),
    ("Eisgebiete, Tundra, verschneite Landschaften", ["eis", "tundra", "schnee", "verschneit", "gletscher", "arktis", "polar", "hoher norden", "frost"]),
    ("Grasland", ["grasland", "savanne", "prärie", "ebene", "busch"]),
    ("Höhlen", ["höhle", "unterirdisch", "verlies", "grotte", "tunnel", "stollen"]),
    ("Sumpf und Moor", ["sumpf", "sümpf", "moor", "morast"]),
    ("Wald und Dschungel", ["wald", "wäld", "dschungel", "regenwald", "urwald", "forst"]),
    ("Wüste und Trockensteppe", ["wüste", "steppe", "sand", "trocken", "sahara", "dünen"]),
    ("Wasser, Strand und kleine Inseln", ["meer", "ozean", "wasser", "strand", "insel", "see", "fluss", "flüss", "küste", "riff", "korallen", "teich", "lagune"]),
    ("Zivilisation und ihre Ruinen", ["stadt", "städt", "dorf", "siedlung", "zivilisation", "ruine", "kanalisation", "gemäuer", "kellergewölbe", "burg", "ort", "häuser"]),
]


def modifikator_erfahren():
    return {"grad": 3, "gf": 9, "st": 0, "lp": "+2", "ap": "+2W6", "angriff": 2, "raufen": 0,
            "abwehr": 2, "resistenzGeist": 2, "resistenzKoerper": 1, "schaden": ""}


def modifikator_selten():
    return {"grad": 8, "gf": 20, "st": 0, "lp": "+3", "ap": "+4W6", "angriff": 4, "raufen": 0,
            "abwehr": 3, "resistenzGeist": 3, "resistenzKoerper": 3, "schaden": ""}


def modifikator_legendaer():
    return {"grad": 12, "gf": 32, "st": 0, "lp": "+5", "ap": "+6W6", "angriff": 6, "raufen": 0,
            "abwehr": 4, "resistenzGeist": 4, "resistenzKoerper": 4, "schaden": "+1"}


def get_page_geometry(pdf_path):
    out = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True, check=True).stdout
    m = re.search(r"Page size:\s*([\d.]+)\s*x\s*([\d.]+)\s*pts", out)
    width, height = (float(m.group(1)), float(m.group(2))) if m else (595.276, 793.701)
    m = re.search(r"Pages:\s*(\d+)", out)
    pages = int(m.group(1)) if m else 0
    return width, height, pages


def extract_right_column_text(pdf_path):
    """Crop every page to the stat-block (right) column and concatenate the text,
    avoiding the left/right column interleaving that plain `pdftotext -layout`
    produces when both columns sit at the same vertical position on a page."""
    width, height, pages = get_page_geometry(pdf_path)
    crop_w = width - RIGHT_COLUMN_X
    lines = []
    for page in range(1, pages + 1):
        result = subprocess.run(
            [
                "pdftotext", "-layout",
                "-f", str(page), "-l", str(page),
                "-x", str(RIGHT_COLUMN_X), "-y", "0",
                "-W", str(crop_w), "-H", str(height),
                str(pdf_path), "-",
            ],
            capture_output=True, text=True, encoding="utf-8", check=True,
        )
        lines.extend(result.stdout.split("\n"))
        lines.append("")  # page boundary acts like a blank line, same as a box's end
    return lines


def smart_join(parts):
    """Join wrapped PDF lines, undoing end-of-line hyphenation (e.g. 'Kehl-' + 'biss'
    -> 'Kehlbiss') while preserving real ' - ' separators (those are followed by a
    capitalized word, not a lowercase word-continuation)."""
    out = ""
    for line in parts:
        line = line.strip()
        if not line:
            continue
        if not out:
            out = line
            continue
        if out.endswith("-") and line[:1].islower():
            out = out[:-1] + line
        elif line.startswith(":"):
            # rare InDesign glyph-run artifact: "EW:Angriff" sometimes splits across
            # lines as "...EW X" + ":Angriff" - drop the stray trailing letter and rejoin.
            out = re.sub(r"\s+\S+$", "", out) + line
        else:
            out = out + " " + line
    return out


def norm(s):
    if s is None:
        return s
    s = s.replace("–", "-").replace("—", "-").replace("−", "-")
    s = s.replace("", "").replace("", "")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def to_int(s, default=None):
    s = s.strip()
    m = re.search(r"-?\d+", s)
    if m:
        return int(m.group(0))
    return default


HEADING_RE = re.compile(
    r"^\s*(?P<name>[^()]+?)\s*(?:\s*)?\(\s*(?P<kat>[^,()]+?)\s*,\s*Grad\s*(?P<grad>-?\d+)\s*(?:-\s*(?P<size>groß|riesig))?\s*\)\s*$"
)

FIELD_STARTS = [
    ("lpap", re.compile(r"^\s*LP\b")),
    ("stat", re.compile(r"^\s*St\b")),
    ("abwehr", re.compile(r"^\s*Abwehr\b")),
    ("angriff", re.compile(r"^\s*Angriff\s*:")),
    ("bes", re.compile(r"^\s*Bes\.?\s*:")),
    ("zaubern", re.compile(r"^\s*»?Zaubern\+")),
    ("vorkommen", re.compile(r"^\s*Vorkommen\s*:")),
    ("besondere", re.compile(r"^\s*Besondere Wesen\s*:")),
]


def classify(line):
    for key, rx in FIELD_STARTS:
        if rx.match(line):
            return key
    return None


def find_headings(lines):
    heads = []
    for i, l in enumerate(lines):
        m = HEADING_RE.match(l)
        if not m:
            continue
        j = i + 1
        while j < len(lines) and lines[j].strip() == "":
            j += 1
        if j < len(lines) and re.match(r"^\s*LP\b", lines[j]):
            if not norm(m.group("name")):
                # name was too long to fit on the "(Kategorie, Grad N)" line and
                # wrapped to its own line above, e.g.:
                #   Flammendrache, erwachsener, 151-300 Jahre
                #   (Drache, Grad 25 - groß)
                k = i - 1
                while k >= 0 and lines[k].strip() == "":
                    k -= 1
                if k >= 0:
                    heads.append((i, m, norm(lines[k])))
                    continue
            heads.append((i, m, norm(m.group("name"))))
    return heads


def collect_block(lines, start):
    block = []
    i = start + 1
    while i < len(lines):
        if lines[i].strip() == "":
            break
        block.append(lines[i])
        i += 1
    return block


def segment_fields(block_lines):
    fields = {}
    current = None
    locked = False  # once "Besondere Wesen:" starts, it always runs to the end of the block
    used = set()  # each field keyword legitimately opens exactly once per block
    for line in block_lines:
        if locked:
            fields["besondere"].append(line)
            continue
        key = classify(line)
        if key and key not in used:
            current = key
            used.add(key)
            fields.setdefault(current, [])
            fields[current].append(line)
            if key == "besondere":
                locked = True
        else:
            if current is not None:
                fields[current].append(line)
    return {k: norm(smart_join(v)) for k, v in fields.items()}


def parse_lpap(text, log, name):
    # LP 1W6+2       AP 1W6-2           TR   [Gf 10]
    m = re.match(
        r"^LP\s+(?P<lp>.+?)\s+AP\s+(?P<ap>.+?)\s+(?P<ruest>[A-Za-z*]{1,3}(?:/[A-Za-z*]{1,3})?)(?=\s|$)(?:\s+Gf\s*(?P<gf>-?\d+)(?:/-?\d+)?)?\s*$",
        text,
    )
    if not m:
        log.append(f"[{name}] lpap unparsed: {text!r}")
        return {"lp": text, "ap": "", "ruestung": "", "gf": None}
    return {
        "lp": m.group("lp").strip(),
        "ap": m.group("ap").strip(),
        "ruestung": m.group("ruest").strip(),
        "gf": to_int(m.group("gf")) if m.group("gf") else None,
    }


def parse_stat(text, log, name):
    # St 20   Gw 100   In t40 B 3/60   [MW...]
    mw = None
    mmw = re.search(r"MW\s*(∞|[+-]?\d+)", text)
    if mmw:
        mw = 999 if mmw.group(1) == "∞" else to_int(mmw.group(1))
        text = text[: mmw.start()].strip()
    m = re.match(
        r"^St\s+(?P<st>\*|-?\d+)\s+Gw\s+(?P<gw>\*|-?\d+)(?:/-?\d+)?(?:\s*\(-?\d+\))?\s+In\s+(?P<intel>t?\*?-?\d*)\s+B\s*(?P<b>[\d/.\-]+)",
        text,
    )
    if not m:
        log.append(f"[{name}] stat unparsed: {text!r}")
        return {"st": 0, "gw": 0, "in": 0, "b_raw": "", "mw": mw or 0}
    st = 0 if m.group("st") == "*" else to_int(m.group("st"), 0)
    gw = 0 if m.group("gw") == "*" else to_int(m.group("gw"), 0)
    intraw = m.group("intel").replace("t", "")
    intel = to_int(intraw, 0) if intraw not in ("", "*") else 0
    return {"st": st, "gw": gw, "in": intel, "b_raw": m.group("b"), "mw": mw or 0}


def parse_abwehr(text, log, name):
    mw = None
    mmw = re.search(r"MW\s*(∞|[+-]?\d+)", text)
    if mmw:
        mw = 999 if mmw.group(1) == "∞" else to_int(mmw.group(1))
        text = text[: mmw.start()].strip()
    m = re.match(r"^Abwehr\s*\+?(?P<ab>\*|-?\d+)\s+Resistenz\s*\+?(?P<rg>\*|-?\d+)\s*/\s*(?P<rk>\*|-?\d+)", text)
    if not m:
        log.append(f"[{name}] abwehr unparsed: {text!r}")
        return {"abwehr": 0, "resistenzGeist": 0, "resistenzKoerper": 0, "mw": mw or 0}
    ab = 0 if m.group("ab") == "*" else to_int(m.group("ab"), 0)
    rg = 0 if m.group("rg") == "*" else to_int(m.group("rg"), 0)
    rk = 0 if m.group("rk") == "*" else to_int(m.group("rk"), 0)
    return {"abwehr": ab, "resistenzGeist": rg, "resistenzKoerper": rk, "mw": mw or 0}


SEP_RE = re.compile(r"\s+-\s+|\s+oder\s+|\s*[;,]\s*")


def split_top_level(text):
    """Split on ' - ', ' oder ' or ';'/',' but only outside of parentheses."""
    parts = []
    depth = 0
    last = 0
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        if depth == 0:
            m = SEP_RE.match(text, i)
            if m:
                parts.append(text[last:i])
                i = m.end()
                last = i
                continue
        i += 1
    parts.append(text[last:])
    return parts


DICE_RE = re.compile(r"^((?:je\s+)?[0-9]+W[0-9]+(?:[+\-][0-9]+)?)")


def split_attack_chunk(chunk):
    chunk = chunk.strip().strip(",")
    m = re.match(r"^(?P<name>[0-9]*×?\s*[A-Za-zÀ-ÿ' .]+?)\s*\+(?P<wert>\d+)\s*(?:\((?P<detail>.*)\))?\s*$", chunk)
    if not m:
        # No "+N" skill value (e.g. a named special maneuver mentioned in the attack
        # list, like "Kehlbiss") - not a rollable attack, treat as a besonderheit instead.
        return None
    detail = (m.group("detail") or "").strip()
    schaden, bemerkung = "", ""
    if detail:
        dm = DICE_RE.match(detail)
        if dm:
            schaden = dm.group(1)
            rest = detail[dm.end():].strip()
            rest = re.sub(r"^[&;]\s*", "", rest)
            rest = re.sub(r"^sowie\s*", "", rest, flags=re.I)
            bemerkung = rest.strip(" ;,")
        else:
            bemerkung = detail
    return {"name": m.group("name").strip(), "wert": int(m.group("wert")), "schaden": schaden, "bemerkung": bemerkung}


def parse_angriff(text):
    if not text:
        return [], []
    body = re.sub(r"^Angriff\s*:\s*", "", text)
    if body.strip().lower() in ("keiner", "keine", "-", "–"):
        return [], []
    parts = split_top_level(body)
    out = []
    extra_notes = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        parsed = split_attack_chunk(p)
        if parsed is None:
            extra_notes.append({"name": p, "wert": None, "bemerkung": ""})
        else:
            out.append(parsed)
    return out, extra_notes


def parse_bes(text):
    if not text:
        return []
    body = re.sub(r"^Bes\.?\s*:\s*", "", text)
    clauses = [c.strip() for c in re.split(r";", body) if c.strip()]
    out = []
    for c in clauses:
        m = re.match(r"^(?P<name>[A-Za-zÀ-ÿ' .]+?)\s*\+(?P<wert>\d+)\s*(?:\((?P<bem>.*)\))?$", c)
        if m:
            out.append({"name": m.group("name").strip(), "wert": int(m.group("wert")), "bemerkung": (m.group("bem") or "").strip()})
        else:
            out.append({"name": c, "wert": None, "bemerkung": ""})
    return out


def parse_zauber(text, log=None, name=""):
    if not text:
        return []
    text = text.replace("»", "").replace("«", "")
    m = re.match(r"^\s*Zaubern\+?(?P<wert>\d+)\s*:\s*(?P<rest>.*)$", text)
    if not m:
        if log is not None:
            log.append(f"[{name}] zaubern unparsed: {text!r}")
        return []
    wert = int(m.group("wert"))
    rest = m.group("rest")
    names = [n.strip() for n in rest.split(",") if n.strip()]
    return [{"name": n, "wert": wert, "bemerkung": ""} for n in names]


def parse_regionen(vorkommen_text):
    if not vorkommen_text:
        return []
    low = vorkommen_text.lower()
    found = []
    for region, keywords in REGION_KEYWORDS:
        for kw in keywords:
            if kw in low:
                found.append(region)
                break
    seen = set()
    out = []
    for r in found:
        if r not in seen:
            seen.add(r)
            out.append(r)
    return out


TABLE_LABELS = {"Grad", "Gf", "St", "LP", "AP", "Angriff", "Raufen", "Abwehr", "Resistenz", "Schaden", "Raufschaden"}


def parse_besondere(text, log, name):
    """Returns (simple_gf_overrides, extended_overrides) - at most one is non-empty."""
    if not text:
        return {}, {}
    if re.search(r"\bGrad\b", text):
        return {}, parse_besondere_table(text, log, name)
    m = re.search(r"Gf\s+e\s*(-?\d+)", text)
    e = to_int(m.group(1)) if m else None
    m = re.search(r"/\s*h\s*(-?\d+)", text)
    h = to_int(m.group(1)) if m else None
    m = re.search(r"/\s*l\s*(-?\d+)", text)
    l = to_int(m.group(1)) if m else None
    return {"e": e, "h": h, "l": l}, {}


def parse_besondere_table(text, log, name):
    tokens = text.split()
    rows = {}
    i = 0
    n = len(tokens)
    started = False
    while i < n:
        tok = tokens[i].rstrip(":")
        # Rows like "Bissschaden"/"Stoßzahnschaden"/"Angriffszahl" are per-creature extra
        # rows with no matching WesenModifikator field - consume and drop them silently.
        if (tok in TABLE_LABELS or tok.endswith("schaden") or tok == "Angriffszahl") and i + 3 < n:
            if tok in TABLE_LABELS:
                rows[tok] = tokens[i + 1:i + 4]
            started = True
            i += 4
            continue
        if started:
            log.append(f"[{name}] extended table stray token skipped: {tokens[i]!r}")
        i += 1
    tiers = ["erfahren", "selten", "legendaer"]
    out = {t: {} for t in tiers}
    for label, vals in rows.items():
        for tidx, tier in enumerate(tiers):
            v = vals[tidx]
            if label == "Grad":
                out[tier]["grad"] = to_int(v, 0)
            elif label == "Gf":
                out[tier]["gf"] = to_int(v, 0)
            elif label == "St":
                out[tier]["st"] = 0 if v == "*" else to_int(v, 0)
            elif label == "LP":
                out[tier]["lp"] = v
            elif label == "AP":
                out[tier]["ap"] = v
            elif label == "Angriff":
                out[tier]["angriff"] = to_int(v, 0)
            elif label == "Raufen":
                out[tier]["raufen"] = to_int(v, 0)
            elif label == "Abwehr":
                out[tier]["abwehr"] = to_int(v, 0)
            elif label == "Schaden":
                out[tier]["schaden"] = v
            elif label == "Resistenz":
                parts = v.split("/")
                out[tier]["resistenzGeist"] = to_int(parts[0], 0)
                out[tier]["resistenzKoerper"] = to_int(parts[1], 0) if len(parts) > 1 else to_int(parts[0], 0)
            # Raufschaden has no matching Wesen field - intentionally dropped
    if "Grad" not in rows:
        log.append(f"[{name}] extended table found but no Grad row parsed: {text!r}")
    return out


FLIEGEND_HINTS = re.compile(r"flieg|Flug|geflügelt|Flügel|schwebt|Schwinge", re.I)
FLY_KATEGORIEN = {"Vogel", "Fledermaus", "Drache", "Drachenähnlicher", "Drachenartiger"}


def parse_b(b_raw, kategorie, whole_text):
    nums = [int(n) for n in re.findall(r"\d+", b_raw)]
    if not nums:
        return 0, 0, None
    if len(nums) == 1:
        return nums[0], 0, None
    is_flyer = kategorie in FLY_KATEGORIEN or bool(FLIEGEND_HINTS.search(whole_text))
    if len(nums) == 2:
        laufen, second = nums
        if is_flyer:
            return laufen, second, None
        else:
            return laufen, 0, second  # second = swim speed note
    if len(nums) >= 3:
        laufen, schwimmen, fliegen = nums[0], nums[1], nums[2]
        return laufen, fliegen, schwimmen
    return nums[0], 0, None


def build_entry(name, kategorie, grad, size, fields, log):
    lpap = parse_lpap(fields.get("lpap", ""), log, name)
    stat = parse_stat(fields.get("stat", ""), log, name)
    abw = parse_abwehr(fields.get("abwehr", ""), log, name)
    mw = abw["mw"] or stat["mw"]
    angriffe, angriff_notes = parse_angriff(fields.get("angriff", ""))
    besonderheiten = parse_bes(fields.get("bes", "")) + angriff_notes
    zauber = parse_zauber(fields.get("zaubern", ""), log, name)
    vorkommen_raw = re.sub(r"^Vorkommen\s*:\s*", "", fields.get("vorkommen", "")).strip()
    regionen = parse_regionen(vorkommen_raw)
    bes_wesen, bes_extended = parse_besondere(fields.get("besondere", ""), log, name)

    whole_text = " ".join(fields.get(k, "") for k in ("angriff", "bes", "vorkommen"))
    b, fliegend, schwimmen = parse_b(stat.get("b_raw", ""), kategorie, whole_text)
    if schwimmen:
        besonderheiten.append({"name": "Schwimmen", "wert": schwimmen, "bemerkung": ""})

    gf = lpap["gf"] if lpap.get("gf") is not None else grad + 3

    erf = modifikator_erfahren()
    sel = modifikator_selten()
    leg = modifikator_legendaer()
    if bes_wesen.get("e") is not None:
        erf["gf"] = bes_wesen["e"]
    if bes_wesen.get("h") is not None:
        sel["gf"] = bes_wesen["h"]
    if bes_wesen.get("l") is not None:
        leg["gf"] = bes_wesen["l"]
    if bes_extended:
        erf.update(bes_extended.get("erfahren", {}))
        sel.update(bes_extended.get("selten", {}))
        leg.update(bes_extended.get("legendaer", {}))

    kategorie_out = kategorie
    if size:
        kategorie_out = f"{kategorie} ({size})"

    return {
        "name": name,
        "system": True,
        "buch": "",
        "kategorie": kategorie_out,
        "grad": grad,
        "gf": gf,
        "lp": lpap["lp"],
        "ap": lpap["ap"],
        "ruestung": lpap["ruestung"],
        "st": stat["st"],
        "gw": stat["gw"],
        "in": stat["in"],
        "b": b,
        "fliegend": fliegend,
        "abwehr": abw["abwehr"],
        "resistenzGeist": abw["resistenzGeist"],
        "resistenzKoerper": abw["resistenzKoerper"],
        "mw": mw,
        "angriffe": angriffe,
        "besonderheiten": besonderheiten,
        "zauber": zauber,
        "regionen": regionen,
        "vorkommen": vorkommen_raw,
        "erfahren": erf,
        "selten": sel,
        "legendaer": leg,
    }


def main():
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")

    lines = extract_right_column_text(PDF_PATH)
    ligatures = {"ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl"}
    for lig, rep in ligatures.items():
        lines = [l.replace(lig, rep) for l in lines]

    heads = find_headings(lines)
    log = []
    entries = []
    seen_names = {}
    for i, m, name in heads:
        kategorie = norm(m.group("kat"))
        grad = int(m.group("grad"))
        size = m.group("size")
        block = collect_block(lines, i)
        fields = segment_fields(block)
        if "lpap" not in fields:
            log.append(f"[{name}] SKIPPED - no LP/AP field found")
            continue
        entry = build_entry(name, kategorie, grad, size, fields, log)
        if name in seen_names:
            seen_names[name] += 1
            log.append(f"[{name}] duplicate name (#{seen_names[name]})")
        else:
            seen_names[name] = 1
        entries.append(entry)

    OUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")

    log_text = (
        f"Total headings found: {len(heads)}\n"
        f"Total entries written: {len(entries)}\n"
        f"Duplicate names: {sum(1 for v in seen_names.values() if v > 1)}\n"
        "\n--- warnings ---\n" + "\n".join(log)
    )
    LOG.write_text(log_text, encoding="utf-8")

    print(f"headings={len(heads)} entries={len(entries)} warnings={len(log)}")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
