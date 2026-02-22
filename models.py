from sqlalchemy import Column, TEXT, INT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Medicine(Base):
    __tablename__ = "medicine"

    bizName = Column(TEXT, nullable=False)
    itemName = Column(TEXT, nullable=False)
    code = Column(INT, primary_key=True)
    efficiency = Column(TEXT)
    useMethod = Column(TEXT)
    Caution = Column(TEXT)
    Warning = Column(TEXT)
    Interaction = Column(TEXT)
    sideEffect = Column(TEXT)
    Storage = Column(TEXT)
    openDe = Column(TEXT)
    updateDe = Column(TEXT)
    Image = Column(TEXT)
