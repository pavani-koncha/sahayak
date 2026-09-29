import math
import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two GPS coordinates using the Haversine formula."""
    R = 6371.0 # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

CATEGORY_TAGS = {
    "hospitals": '["amenity"~"hospital|clinic"]',
    "police": '["amenity"="police"]',
    "fire_stations": '["amenity"="fire_station"]'
}

async def fetch_nearby_places(
    latitude: float,
    longitude: float,
    category: str = "hospitals",
    radius_meters: int = 15000
) -> Dict[str, Any]:
    """
    Fetch real nearby emergency services from OpenStreetMap Overpass API based on user coordinates.
    Never fabricates coordinates or locations.
    """
    tag_filter = CATEGORY_TAGS.get(category.lower(), CATEGORY_TAGS["hospitals"])
    
    query = f"""
    [out:json][timeout:15];
    (
      node{tag_filter}(around:{radius_meters},{latitude},{longitude});
      way{tag_filter}(around:{radius_meters},{latitude},{longitude});
    );
    out center 25;
    """

    overpass_endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ]

    places: List[Dict[str, Any]] = []
    service_available = False
    error_message: Optional[str] = None

    for endpoint in overpass_endpoints:
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.post(endpoint, data={"data": query})
                if response.status_code == 200:
                    data = response.json()
                    elements = data.get("elements", [])
                    service_available = True
                    
                    for el in elements:
                        tags = el.get("tags", {})
                        name = tags.get("name")
                        if not name:
                            # Skip unnamed elements
                            continue
                            
                        # Coordinates
                        plat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
                        plon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)
                        
                        if plat is None or plon is None:
                            continue

                        dist = haversine_distance(latitude, longitude, plat, plon)
                        
                        # Formulate real address from OSM tags
                        address_parts = [
                            tags.get("addr:housenumber"),
                            tags.get("addr:street"),
                            tags.get("addr:suburb"),
                            tags.get("addr:city") or tags.get("addr:town") or tags.get("addr:district"),
                            tags.get("addr:postcode")
                        ]
                        address = ", ".join([p for p in address_parts if p]) or tags.get("description") or "Emergency Facility"
                        phone = tags.get("phone") or tags.get("contact:phone") or tags.get("emergency:phone")

                        places.append({
                            "id": f"osm-{el.get('type')}-{el.get('id')}",
                            "name": name,
                            "category": category,
                            "distance_km": dist,
                            "address": address,
                            "latitude": plat,
                            "longitude": plon,
                            "phone": phone
                        })

                    # Sort by nearest distance
                    places.sort(key=lambda x: x["distance_km"])
                    break
        except Exception as e:
            logger.warning(f"Error querying {endpoint}: {e}")
            error_message = str(e)
            continue

    return {
        "success": service_available,
        "category": category,
        "count": len(places),
        "user_latitude": latitude,
        "user_longitude": longitude,
        "places": places,
        "error": None if service_available else "Nearby-service search is temporarily unavailable. Check network connectivity or try again in a few moments."
    }
