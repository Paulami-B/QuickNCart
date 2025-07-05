import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os

load_dotenv()

config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASS')
}

DB_NAME = 'Grocery_Store'

TABLES = {}

TABLES['products'] = (
    "CREATE TABLE IF NOT EXISTS `Products`("
    "   `ID` INT PRIMARY KEY AUTO_INCREMENT,"
    "   `Name` VARCHAR(50) NOT NULL,"
    "   `Unit` ENUM('piece', 'pack', 'kg', 'g', 'litre', 'ml', 'dozen', 'box') NOT NULL,"
    "   `Price_Per_Unit` FLOAT NOT NULL"
    ") ENGINE=InnoDB"
)

TABLES['orders'] = (
    "CREATE TABLE IF NOT EXISTS `Orders`("
    "   `ID` INT(5) ZEROFILL PRIMARY KEY AUTO_INCREMENT,"
    "   `Date` DATETIME NOT NULL,"
    "   `Customer_Name` VARCHAR(60)"
    ") ENGINE=InnoDB"
)

TABLES['order_items'] = (
    "CREATE TABLE IF NOT EXISTS `Order_Items`("
    "   `O_ID` INT(5) ZEROFILL,"
    "   `P_ID` INT,"
    "   `Quantity` DOUBLE,"
    "   PRIMARY KEY (`O_ID`, `P_ID`), KEY `O_ID` (`O_ID`),"
    "   CONSTRAINT `Order_Items_ibfk_1` FOREIGN KEY (`O_ID`) "
    "   REFERENCES `Orders` (`ID`) ON DELETE CASCADE,"
    "   CONSTRAINT `Order_Items_ibfk_2` FOREIGN KEY (`P_ID`) "
    "   REFERENCES `Products` (`ID`) ON DELETE CASCADE"
    ") ENGINE=InnoDB"
)

try:
    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()

    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    print(f"Database `{DB_NAME}` ensured")

    cnx.database = DB_NAME

    for table_name, ddl in TABLES.items():
        cursor.execute(ddl)
        print(f"Table `{table_name}` ensured")
    
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Access denied: Check your username or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist and could not be created.")
    else:
        print(err)

finally:
    cursor.close()
    cnx.close()