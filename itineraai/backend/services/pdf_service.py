import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.colors import HexColor


# ───────────────────────── COLORS ─────────────────────────
GOLD  = HexColor("#C9A84C")
DARK  = HexColor("#1a1a1a")
CREAM = HexColor("#F5EDD6")
GREY  = HexColor("#555555")


# ───────────────────────── STYLES ─────────────────────────
def _styles():
    s = getSampleStyleSheet()

    base = dict(fontName="Helvetica", textColor=DARK)

    styles = {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=s["Normal"],
            fontSize=32,
            leading=40,
            alignment=TA_CENTER,
            textColor=GOLD,
            fontName="Helvetica-Bold",
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=s["Normal"],
            fontSize=13,
            alignment=TA_CENTER,
            textColor=GREY,
            spaceAfter=30,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=s["Normal"],
            fontSize=18,
            leading=24,
            fontName="Helvetica-Bold",
            textColor=GOLD,
            spaceBefore=18,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=s["Normal"],
            fontSize=13,
            leading=18,
            fontName="Helvetica-Bold",
            textColor=DARK,
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=s["Normal"],
            fontSize=10,
            leading=16,
            spaceAfter=6,
            textColor=DARK,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=s["Normal"],
            fontSize=10,
            leading=16,
            leftIndent=16,
            bulletIndent=8,
            spaceAfter=4,
        ),
        "label": ParagraphStyle(
            "label",
            parent=s["Normal"],
            fontSize=8,
            textColor=GREY,
            spaceAfter=2,
        ),
    }

    return styles


# ───────────────────────── MARKDOWN PARSER ─────────────────────────
def _md_to_flowables(text: str, styles: dict):
    flowables = []

    for line in text.split("\n"):
        stripped = line.strip()

        if not stripped:
            flowables.append(Spacer(1, 6))
            continue

        if stripped.startswith("# "):
            flowables.append(Paragraph(stripped[2:], styles["h1"]))
            flowables.append(HRFlowable(width="100%", thickness=0.5, color=GOLD))

        elif stripped.startswith("## "):
            flowables.append(Paragraph(stripped[3:], styles["h2"]))

        elif stripped.startswith("### "):
            h3 = ParagraphStyle(
                "h3",
                parent=styles["h2"],
                fontSize=11,
                textColor=GREY,
            )
            flowables.append(Paragraph(stripped[4:], h3))

        elif stripped.startswith("- ") or stripped.startswith("* "):
            flowables.append(Paragraph(f"• {stripped[2:]}", styles["bullet"]))

        elif stripped.startswith("**") and stripped.endswith("**"):
            bold = ParagraphStyle(
                "bold",
                parent=styles["body"],
                fontName="Helvetica-Bold",
            )
            flowables.append(Paragraph(stripped.strip("*"), bold))

        else:
            flowables.append(Paragraph(stripped, styles["body"]))

    return flowables


# ───────────────────────── MAIN PDF FUNCTION ─────────────────────────
def generate_pdf(
    destination: str,
    date_from: str,
    date_to: str,
    travelers: int,
    language: str,
    city_report: str,
    guide_report: str,
    travel_plan: str,
) -> bytes:

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = _styles()
    story = []

    # ───────── COVER PAGE ─────────
    story.append(Spacer(1, 60))
    story.append(Paragraph("✈ ItineraAI", styles["cover_title"]))
    story.append(Paragraph(f"Travel Report: {destination}", styles["cover_sub"]))
    story.append(
        Paragraph(
            f"{date_from} → {date_to} | {travelers} Traveler(s) | {language}",
            styles["cover_sub"],
        )
    )
    story.append(Spacer(1, 40))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD))
    story.append(Spacer(1, 60))

    # ───────── TABLE OF CONTENTS ─────────
    toc_data = [
        ["Section", "Content"],
        ["📋 City Report", "Accommodations, Costs, Visa, Weather"],
        ["🗺️ Guide Report", "Attractions, Food, Events, Tips"],
        ["📅 Travel Plan", "Day-by-Day Itinerary"],
    ]

    toc = Table(toc_data, colWidths=[6 * cm, 10 * cm])
    toc.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), GOLD),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fafafa")]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(toc)
    story.append(Spacer(1, 30))

    # ───────── SECTION HELPER ─────────
    def add_section(title, content):
        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=2, color=GOLD))
        story.append(Paragraph(title, styles["h1"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GOLD))
        story.extend(_md_to_flowables(content, styles))

    add_section("📋 City Report", city_report)
    add_section("🗺️ Guide & Attractions", guide_report)
    add_section("📅 Travel Plan", travel_plan)

    # ───────── FOOTER ─────────
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GOLD))
    story.append(Paragraph("Generated by ItineraAI · Powered by Groq LLaMA 3", styles["label"]))

    doc.build(story)
    buffer.seek(0)

    return buffer.getvalue()