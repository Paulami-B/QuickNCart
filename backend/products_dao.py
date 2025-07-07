from sql_connection import get_sql_connection

def get_products(connection):
    cursor = connection.cursor()
    query = "SELECT ID, Name, Unit, Price_Per_Unit FROM Products"
    cursor.execute(query)
    response = []
    for ID, Name, Unit, Price in cursor:
        response.append({
            'id': ID,
            'name': Name,
            'unit': Unit,
            'price': Price
        })
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO Products "
            "(Name, Unit, Price_Per_Unit) "
            "VALUES (%s, %s, %s) "
            "ON DUPLICATE KEY UPDATE "
            "Unit = VALUES(Unit), "
            "Price_Per_Unit = VALUES(Price_Per_Unit)")
    data = (product['product_name'], product['unit'], product['price_per_unit'])
    cursor.execute(query, data)
    return cursor.lastrowid

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM Products WHERE ID=%s")
    cursor.execute(query, (product_id,))
    connection.commit()

    return product_id

def make_name_unique(connection):
    cursor = connection.cursor()
    cursor.execute("ALTER TABLE Products ADD UNIQUE (Name)")
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    make_name_unique(connection)