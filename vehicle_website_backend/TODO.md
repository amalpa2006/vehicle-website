# TODO

- [ ] Fix SQLAlchemy `Mapped[...]` typing issue causing `TypeError: descriptor '__getitem__' requires a 'typing.Union' object but received a 'tuple'`.
- [ ] Update `app/models.py` field annotations for union/optional types to SQLAlchemy-friendly forms.
- [ ] Add a quick startup import check (run `python -c "import app.main"`).
- [ ] Re-run `uvicorn app.main:app --reload` to confirm the server starts.

