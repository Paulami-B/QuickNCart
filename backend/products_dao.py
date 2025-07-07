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
    print(f"DATA: {product}")
    query = ("INSERT INTO Products "
             "(Name, Unit, Price_Per_Unit) "
             "VALUES (%s, %s, %s)")
    data = (product['product_name'], product['unit'], product['price_per_unit'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM Products WHERE ID=%s")
    cursor.execute(query, (product_id,))
    connection.commit()

    return cursor.lastrowid


if __name__ == '__main__':
    connection = get_sql_connection()
    # # print(get_all_products(connection))
    # print(delete_product(connection, 1))