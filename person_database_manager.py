import sqlite3

PERSON_SCHEMA = """
                CREATE TABLE IF NOT EXISTS Person
                (id INTEGER PRIMARY KEY,
                name TEXT UNIQUE)"""
POINTS_SCHEMA = """
                CREATE TABLE IF NOT EXISTS Points
                (id INTEGER PRIMARY KEY,
                person_name TEXT,
                points INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(person_name) REFERENCES Person(name))"""
database_path = 'person_database.sql'


class PersonManager:

  def __init__(self) -> None:
    self.ConnectToDatabase()
    pass

  def AddNewPerson(self, name: str):
    with sqlite3.connect(database_path) as conn:
      cursor = conn.cursor()
      cursor.execute("INSERT INTO Person (name) VALUES (?)", (name, ))
      conn.commit()
      print(f"Added new person: {name}")

  def GetPersonNames(self) -> list[str]:
    with sqlite3.connect(database_path) as conn:
      cursor = conn.cursor()
      cursor.execute("SELECT name FROM Person")
      return [row[0] for row in cursor.fetchall()]

  def GetPersonPoints(self, person_name: str) -> int:
    with sqlite3.connect(database_path) as conn:
      cursor = conn.cursor()
      cursor.execute("SELECT SUM(points) FROM Points WHERE person_name=?",
                     (person_name, ))
      return cursor.fetchone()[0]

  def GetAllPersonPoints(self) -> list[tuple[str, int]]:
    with sqlite3.connect(database_path) as conn:
      cursor = conn.cursor()
      cursor.execute(
          "SELECT person_name, SUM(points) FROM Points GROUP BY person_name")
      return cursor.fetchall()

  def GetAllPersonPointsRange(self, range_: str) -> list[tuple[str, int]]:
    if (range_ == "week"):
      with sqlite3.connect(database_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT person_name, SUM(points) FROM Points WHERE timestamp > datetime('now', '-7 days') GROUP BY person_name"
        )
        return cursor.fetchall()
    elif (range_ == "month"):
      with sqlite3.connect(database_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT person_name, SUM(points) FROM Points WHERE timestamp > datetime('now', '-1 month') GROUP BY person_name"
        )
        return cursor.fetchall()
    elif (range_ == "all time"):
      return self.GetAllPersonPoints()
    else:
      print("Invalid range")
      return []

  def AddPointsToPerson(self, person_name: str, points: int):
    with sqlite3.connect(database_path) as conn:
      cursor = conn.cursor()
      cursor.execute("INSERT INTO Points (person_name, points) VALUES (?, ?)",
                     (person_name, points))
      conn.commit()
      print(f"Added {points} points to {person_name}")

  def ConnectToDatabase(self):
    # Connect to an existing database (or create a new one if it doesn't exist)
    with sqlite3.connect(database_path) as conn:
      # Create a cursor object
      cursor = conn.cursor()
      cursor.execute(PERSON_SCHEMA)
      cursor.execute(POINTS_SCHEMA)
      conn.commit()
