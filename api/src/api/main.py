from dataclasses import dataclass
from datetime import datetime
from typing import Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from fastapi_users import FastAPIUsers

import api.db.functions.all as db
from api.db.functions.all import (
    insert_visit_fetchone,
    select_crawls_fetchall,
    select_user_counts_fetchall,
    select_user_summary_fetchone,
    select_venue_by_venue_id_fetchone,
    select_venues_by_crawl_id_fetchall,
    select_venues_fetchall,
    select_visit_fetchone,
    select_visits_by_crawl_id_fetchall,
    select_visits_fetchall,
    update_user_display_name,
    update_visit,
)
from api.db.types.all import (
    CrawlData,
    CrawlVenueData,
    CrawlVisitData,
    SingleUserVisitData,
    SingleVenueData,
    UserCountData,
    UserSummaryData,
    VenueData,
    VisitData,
)
from api.lifespan import get_db_connection, lifespan
from api.users.auth import auth_backend
from api.users.db import FastApiUser
from api.users.manager import get_user_manager
from api.users.schemas import UserCreate, UserRead
from api.utils import (
    get_env_variable,
    get_env_variable_with_default,
)

app = FastAPI(title="Real Ale Trail tracker", lifespan=lifespan)


@app.get("/", summary="Say hello!", tags=["home"])
async def hello() -> str:
    return "Hello!"


fastapi_users = FastAPIUsers[FastApiUser, int](get_user_manager, [auth_backend])
current_user = fastapi_users.current_user()


@app.get("/users", summary="Get all users and their counts", tags=["user"])
async def get_users() -> list[UserCountData]:
    return select_user_counts_fetchall(get_db_connection())


@dataclass
class NotFoundResponse:
    detail: str


@app.get(
    "/users/{user_id}",
    summary="Get a user and their visits",
    tags=["user"],
    responses={404: {"model": NotFoundResponse}},
)
async def get_user_by_user_id(user_id: int) -> UserSummaryData:
    summary = select_user_summary_fetchone(get_db_connection(), user_id)
    if summary is None:
        raise HTTPException(status_code=404)
    return summary


@app.get("/venues", summary="Get a list of venues and their visits", tags=["venue"])
async def get_venues(user_id: Optional[int] = None) -> list[VenueData]:
    return select_venues_fetchall(get_db_connection(), user_id)


@app.get(
    "/venues/{venue_id}",
    summary="Get a venue and its visits",
    tags=["venue"],
    responses={404: {"model": NotFoundResponse}},
)
async def get_venue_by_id(
    venue_id: int, user_id: Optional[int] = None
) -> SingleVenueData:
    venue = select_venue_by_venue_id_fetchone(get_db_connection(), user_id, venue_id)
    if venue is None:
        raise HTTPException(status_code=404)
    return venue


@app.get(
    "/crawls",
    summary="Get a list of crawls and their venues",
    tags=["crawl"],
)
async def get_crawl() -> list[CrawlData]:
    return select_crawls_fetchall(get_db_connection())


@app.get(
    "/crawls/{crawl_id}/venues",
    summary="Get a list of venues and their visits in a given crawl",
    tags=["crawl"],
)
async def get_crawl_venues(crawl_id: int) -> list[CrawlVenueData]:
    return select_venues_by_crawl_id_fetchall(get_db_connection(), crawl_id)


@app.get("/visits", summary="Get all the visits", tags=["visit"])
async def get_visits() -> list[VisitData]:
    return select_visits_fetchall(get_db_connection())


@app.get(
    "/visit/{visit_id}",
    summary="Get a particular visit",
    tags=["visit"],
    responses={404: {"model": NotFoundResponse}},
)
async def get_visit(visit_id: int) -> VisitData:
    visit = select_visit_fetchone(get_db_connection(), visit_id)
    if visit is None:
        raise HTTPException(status_code=404)
    return visit


@app.get(
    "/crawls/{crawl_id}/visits",
    summary="Get a list of visits in a given crawl",
    tags=["crawl"],
)
async def get_crawl_visits(crawl_id: int) -> list[CrawlVisitData]:
    return select_visits_by_crawl_id_fetchall(get_db_connection(), crawl_id)


@app.post("/visit", summary="Log a visit", tags=["visit"])
async def post_visit(
    venue_id: int,
    visit_date: datetime,
    notes: Optional[str] = None,
    rating: Optional[int] = None,
    drink: Optional[str] = None,
    user: FastApiUser = Depends(current_user),
) -> None:
    insert_visit_fetchone(
        get_db_connection(), user.id, venue_id, visit_date, notes, rating, drink
    )


@app.patch("/visit/{visit_id}", summary="Update details about a visit", tags=["visit"])
async def patch_visit(
    visit_id: int,
    notes: str,
    rating: int,
    drink: str,
    user: FastApiUser = Depends(current_user),
) -> None:
    update_visit(get_db_connection(), user.id, visit_id, notes, rating, drink)


@app.delete("/visit/{visit_id}", summary="Delete a visit", tags=["visit"])
async def delete_visit(
    visit_id: int,
    user: FastApiUser = Depends(current_user),
) -> None:
    db.delete_visit(get_db_connection(), user.id, visit_id)


app.include_router(
    fastapi_users.get_auth_router(auth_backend, requires_verification=True),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)


@dataclass
class UserPublicDetails:
    user_id: int
    email: str
    display_name: str
    is_verified: bool
    visits: list[SingleUserVisitData]


@app.get("/auth/me", summary="Get details about the current user", tags=["auth"])
async def get_user_details(
    user: FastApiUser = Depends(current_user),
) -> UserPublicDetails:
    user_details = select_user_summary_fetchone(get_db_connection(), user.id)
    return UserPublicDetails(
        user.id,
        user.email,
        user.display_name,
        user.is_verified,
        user_details.visits if user_details is not None else [],
    )


@app.patch("/auth/me/display-name", tags=["auth"])
async def post_update_display_name(
    display_name: str, user: FastApiUser = Depends(current_user)
) -> None:
    update_user_display_name(get_db_connection(), user.id, display_name)


def start() -> None:
    if get_env_variable("API_ENV") == "prod":
        reload = False
    elif get_env_variable("API_ENV") == "dev":
        reload = True
    else:
        raise RuntimeError("API_ENV not set")
    port_var = get_env_variable_with_default("API_PORT", "8000")
    if not port_var.isnumeric():
        raise RuntimeError(f"API_PORT must be number but it is {port_var}")
    else:
        port = int(port_var)
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=port,
        reload=reload,
    )


if __name__ == "__main__":
    start()
