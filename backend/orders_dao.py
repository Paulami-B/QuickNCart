from sql_connection import get_sql_connection

def insert_new_order(connection, order):
    cursor = connection.cursor()
    query = ("INSERT INTO Orders "
            "(Date, Customer_Name) "
            "VALUES (%s, %s)")
    
    data = (order['date'], order['c_name'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def get_order_details(connection, o_id):
    cursor = connection.cursor()
    query = ("SELECT ID, Date, Customer_Name FROM Orders WHERE ID=%s")

    cursor.execute(query, o_id)

    response = []
    for ID, Date, Customer_Name in cursor:
        response.append({
            'id': ID,
            'date': Date,
            'c_name': Customer_Name
        })
    
    return response

def delete_order_details(connection, order_id):
    cursor = connection.cursor()
    query = ("DELETE FROM Orders WHERE ID=" + order_id)

    cursor.execute(query)
    cursor.commit()

    return cursor.lastrowid