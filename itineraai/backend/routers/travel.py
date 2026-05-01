from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, TripReport, User
from services.ai_service import generate_all_reports
from services.image_service import get_city_images
from services.pdf_service import generate_pdf
from routers.auth import get_current_user

router = APIRouter(prefix="/travel", tags=["travel"])


# ── Request Schema ──
class TripInput(BaseModel):
    destination: str
    date_from: str
    date_to: str
    travelers: int
    budget: str = "Medium"
    style: str = "Mixed"
    language: str = "English"
    from_city: str = "India"


# ── Generate Trip ──
@router.post("/generate")
async def generate_plan(
    inputs: TripInput,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        inp = inputs.dict()

        # AI generation
        reports = await generate_all_reports(inp, inputs.language)

        # images
        images = await get_city_images(inputs.destination, 8)

        # Save DB record
        trip = TripReport(
            user_id=user.id,
            destination=inputs.destination,
            date_from=inputs.date_from,
            date_to=inputs.date_to,
            travelers=inputs.travelers,
            budget=inputs.budget,
            style=inputs.style,
            language=inputs.language,
            city_report=reports["city_report"],
            guide_report=reports["guide_report"],
            travel_plan=reports["travel_plan"],
        )

        db.add(trip)
        db.commit()
        db.refresh(trip)

        return {
            "id": trip.id,
            "city_report": reports["city_report"],
            "guide_report": reports["guide_report"],
            "travel_plan": reports["travel_plan"],
            "images": images,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

from typing import cast
# ── PDF Download ──
@router.get("/pdf/{trip_id}")
def download_pdf(
    trip_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    trip = db.query(TripReport).filter(
        TripReport.id == trip_id,
        TripReport.user_id == user.id
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Report not found")

    pdf_bytes = generate_pdf(
        destination=str(trip.destination),
        date_from=str(trip.date_from),
        date_to=str(trip.date_to),
        travelers=int(cast(int, trip.travelers)),
        language=str(trip.language),
        city_report=str(trip.city_report),
        guide_report=str(trip.guide_report),
        travel_plan=str(trip.travel_plan),
    )

    filename = f"ItineraAI_{trip.destination.replace(' ', '_')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


# ── History ──
@router.get("/history")
def history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    trips = (
        db.query(TripReport)
        .filter(TripReport.user_id == user.id)
        .order_by(TripReport.created_at.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "id": t.id,
            "destination": t.destination,
            "date_from": t.date_from,
            "date_to": t.date_to,
            "created_at": str(t.created_at),
        }
        for t in trips
    ]